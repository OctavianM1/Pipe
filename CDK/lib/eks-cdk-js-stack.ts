import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { CfnParameter, CustomResource, Duration, CfnJson } from 'aws-cdk-lib';
import { Vpc, IVpc, InstanceType, Port, BlockDeviceVolume, EbsDeviceVolumeType, Instance, MachineImage, AmazonLinuxGeneration, SecurityGroup, Peer } from 'aws-cdk-lib/aws-ec2';
import { AwsAuth, Cluster, EndpointAccess, KubernetesVersion, KubernetesManifest, CfnAddon } from 'aws-cdk-lib/aws-eks';
import { PolicyStatement, Effect, Role, ManagedPolicy, ServicePrincipal, OpenIdConnectPrincipal } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Runtime, SingletonFunction, Code } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import * as yaml from 'js-yaml';

import { eksVpc, addEndpoint } from '../lib/vpc-stack';

interface ekstackprops extends cdk.StackProps {
}

export class Ekstack extends cdk.Stack {
  public readonly cluster: Cluster
  public readonly awsauth: AwsAuth

  constructor(scope: Construct, id: string, props: ekstackprops) {
    super(scope, id, props);
    const k8sversion = new CfnParameter(this, 'k8sVersion', {
      type: 'String',
      description: 'K8s Version',
      default: '1.21',
    });
    const eksLoggingOpts = new CfnParameter(this, 'eksLoggingOpts', {
      type: 'CommaDelimitedList',
      default: 'api,audit,authenticator,controllerManager,scheduler',
      description: 'EKS Logging values,leave empty to disable, options https://docs.aws.amazon.com/eks/latest/APIReference/API_LogSetup.html#AmazonEKS-Type-LogSetup-types,',
    });

    const vpc = this.getOrCreateVpc(this);
    const bastionHostLinuxSecurityGroup = new SecurityGroup(this, 'bastionHostSecurityGroup', {
      allowAllOutbound: false,
      securityGroupName: this.getOrCreateEksName(this) + '-bastionSecurityGroup',
      vpc: vpc,
    });
    bastionHostLinuxSecurityGroup.connections.allowTo(Peer.anyIpv4(), Port.tcp(443), 'Outbound to 443 only');
    const bastionHostPolicy = new ManagedPolicy(this, 'bastionHostManagedPolicy');
    bastionHostPolicy.addStatements(new PolicyStatement({
      resources: ['*'],
      actions: [
        'eks:DescribeNodegroup',
        'eks:ListNodegroups',
        'eks:DescribeCluster',
        'eks:ListClusters',
        'eks:AccessKubernetesApi',
        'eks:ListUpdates',
        'eks:ListFargateProfiles',
      ],
      effect: Effect.ALLOW,
      sid: 'EKSReadonly',
    }));
    const bastionHostRole = new Role(this, 'bastionHostRole', {
      roleName: this.getOrCreateEksName(this) + '-bastion-host',
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        bastionHostPolicy,
      ],
    });
    const bastionHostLinux = new Instance(this, 'BastionEKSHost', {
      vpc: vpc,
      instanceName: this.getOrCreateEksName(this) + '-EKSBastionHost',
      instanceType: new InstanceType('t3.small'),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: bastionHostLinuxSecurityGroup,
      role: bastionHostRole,
      blockDevices: [{
        deviceName: '/dev/xvda',
        volume: BlockDeviceVolume.ebs(30, {
          volumeType: EbsDeviceVolumeType.GP3,
          encrypted: true,
        }),
      }],
    });

    const clusterKmsKey = new Key(this, 'ekskmskey', {
      enableKeyRotation: true,
      alias: cdk.Fn.join('', ['alias/', 'eks/', this.getOrCreateEksName(this)]),
    });
    this.cluster = new Cluster(this, 'EKSCluster', {
      version: KubernetesVersion.of(k8sversion.valueAsString),
      defaultCapacity: 0,
      endpointAccess: EndpointAccess.PRIVATE,
      vpc: vpc,
      secretsEncryptionKey: clusterKmsKey,
      mastersRole: bastionHostLinux.role,
      clusterName: this.getOrCreateEksName(this),
      placeClusterHandlerInVpc: true,
    });
    bastionHostLinux.connections.allowTo(this.cluster, Port.tcp(443), 'Allow between BastionHost and EKS ');
    bastionHostLinux.userData.addCommands(
      `VERSION=$(aws --region ${this.region} eks describe-cluster --name ${this.cluster.clusterName} --query 'cluster.version' --output text)`,
      'echo \'K8s version is $VERSION\'',
      'curl -LO https://dl.k8s.io/release/v$VERSION.0/bin/linux/amd64/kubectl',
      'install -o root -g root -m 0755 kubectl /bin/kubectl',
    );
    this.awsauth = new AwsAuth(this, 'EKS_AWSAUTH', {
      cluster: this.cluster,
    });

    const manifestConsoleViewGroup = yaml.loadAll(fs.readFileSync('manifests/consoleViewOnlyGroup.yaml', 'utf-8'));
    const manifestConsoleViewGroupDeploy = new KubernetesManifest(this, 'eks-group-view-only', {
      cluster: this.cluster,
      manifest: manifestConsoleViewGroup,
    });
    this.awsauth.node.addDependency(manifestConsoleViewGroupDeploy);
    this.awsauth.addMastersRole(bastionHostLinux.role, `${bastionHostLinux.role.roleArn}/{{SessionName}}`);
    const awsNodeconditionsPolicy = new CfnJson(this, 'awsVpcCniconditionPolicy', {
      value: {
        [`${this.cluster.openIdConnectProvider.openIdConnectProviderIssuer}:aud`]: 'sts.amazonaws.com',
        [`${this.cluster.openIdConnectProvider.openIdConnectProviderIssuer}:sub`]: 'system:serviceaccount:kube-system:aws-node',
      },
    });
    const awsNodePrincipal = new OpenIdConnectPrincipal(this.cluster.openIdConnectProvider).withConditions({
      StringEquals: awsNodeconditionsPolicy,
    });
    const awsVpcCniRole = new Role(this, 'awsVpcCniRole', {
      assumedBy: awsNodePrincipal,
    });

    awsVpcCniRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
    (() => new CfnAddon(this, 'vpc-cni', {
      addonName: 'vpc-cni',
      resolveConflicts: 'OVERWRITE',
      serviceAccountRoleArn: awsVpcCniRole.roleArn,
      clusterName: this.cluster.clusterName,
      addonVersion: this.node.tryGetContext('eks-addon-vpc-cni-version'),
    }))();

    (() => new CfnAddon(this, 'kube-proxy', {
      addonName: 'kube-proxy',
      resolveConflicts: 'OVERWRITE',
      clusterName: this.cluster.clusterName,
      addonVersion: this.node.tryGetContext('eks-addon-kube-proxy-version'),
    }))();
    (() => new CfnAddon(this, 'core-dns', {
      addonName: 'coredns',
      resolveConflicts: 'OVERWRITE',
      clusterName: this.cluster.clusterName,
      addonVersion: this.node.tryGetContext('eks-addon-coredns-version'),
    }))();
    const eksLoggingCustomLambdaPolicy = new PolicyStatement(
      {
        resources: [
          this.cluster.clusterArn,
          `${this.cluster.clusterArn}/update-config`,
        ],
        actions: [
          'eks:UpdateClusterConfig',
          'eks:DescribeCluster',
        ],
      });
    const eksLoggingCustomLambda = new SingletonFunction(this, 'eksLoggingLambdaFunctiononEvent', {
      uuid: this.stackName + 'eksLoggingLambdaFunctiononEvent',
      functionName: this.stackName + 'eksLoggingLambdaFunctiononEvent',
      runtime: Runtime.PYTHON_3_8,
      code: Code.fromAsset(path.join(__dirname, 'custom-resources')),
      handler: 'eksloggingOnEvent.on_event',
      initialPolicy: [eksLoggingCustomLambdaPolicy],
      timeout: Duration.seconds(300),
    });
    const eksLoggingCustomLambdaisComplete = new SingletonFunction(this, 'eksLoggingLambdaFunctionisComplete', {
      uuid: this.stackName + 'eksLoggingLambdaFunctionisComplete',
      functionName: this.stackName + 'eksLoggingLambdaFunctionisComplete',
      runtime: Runtime.PYTHON_3_8,
      code: Code.fromAsset(path.join(__dirname, 'custom-resources')),
      handler: 'eksloggingOnEvent.is_complete',
      initialPolicy: [eksLoggingCustomLambdaPolicy],
      timeout: Duration.seconds(300),
    });
    const eksLoggingProvider = new Provider(this, 'eksLoggingProvider', {
      onEventHandler: eksLoggingCustomLambda,
      isCompleteHandler: eksLoggingCustomLambdaisComplete,
      logRetention: RetentionDays.ONE_WEEK,
      totalTimeout: Duration.minutes(10),
      queryInterval: Duration.seconds(300),
    });
    (() => new CustomResource(this, 'eksLoggingCustomResource', {
      serviceToken: eksLoggingProvider.serviceToken,
      properties: {
        eksCluster: this.getOrCreateEksName(this),
        loggingOpts: eksLoggingOpts.valueAsList,
      },
    }))();
  }

  public createNodegroupRole(id: string): Role {
    const role = new Role(this, id, {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });
    role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
    role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
    this.awsauth.addRoleMapping(role, {
      username: 'system:node:{{EC2PrivateDNSName}}',
      groups: [
        'system:bootstrappers',
        'system:nodes',
      ],
    });
    return role;
  }

  private getOrCreateVpc(scope: Construct): IVpc {
    const stack = cdk.Stack.of(scope);
    if (stack.node.tryGetContext('use_default_vpc') === '1') {
      return Vpc.fromLookup(stack, 'EKSNetworking', { isDefault: true });
    }
    if (stack.node.tryGetContext('use_vpc_id') !== undefined) {
      return Vpc.fromLookup(stack, 'EKSNetworking', { vpcId: stack.node.tryGetContext('use_vpc_id') });
    }
    const vpc = new Vpc(stack, stack.stackName + '-EKSNetworking', eksVpc);
    addEndpoint(stack, vpc);
    return vpc;
  }

  private getOrCreateEksName(scope: Construct): string {
    const stack = cdk.Stack.of(scope);
    if (stack.node.tryGetContext('cluster_name') !== undefined) {
      return stack.node.tryGetContext('cluster_name');
    }
    return 'myekscluster';
  }
}
