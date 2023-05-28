import * as cdk from 'aws-cdk-lib';
import { CfnParameter, Fn } from 'aws-cdk-lib';
import { CfnLaunchTemplate, MultipartBody, MultipartUserData, UserData } from 'aws-cdk-lib/aws-ec2';
import { Cluster, Nodegroup } from 'aws-cdk-lib/aws-eks';
import { Role, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface k8snodegroupsProps extends cdk.StackProps {
  eksCluster: Cluster,
  nodeGroupRole: Role
}

export class K8snodegroups extends cdk.Stack {
  constructor (scope: Construct,
    id: string,
    props: k8snodegroupsProps) {
    super(scope, id, props);
    const nodegroupMax = new CfnParameter(this, 'nodegroupMax', {
      type: 'Number',
      description: 'Max number of EKS worker nodes to scale up to',
      default: 10,
    });
    const nodegroupCount = new CfnParameter(this, 'nodegroupCount', {
      type: 'Number',
      description: 'Desired Count of EKS Worker Nodes to launch',
      default: 2,
    });
    const nodegroupMin = new CfnParameter(this, 'nodegroupMin', {
      type: 'Number',
      description: 'Min number of EKS worker nodes to scale down to',
      default: 2,
    });
    const nodeType = new CfnParameter(this, 'nodegroupInstanceType', {
      type: 'String',
      description: 'Instance Type to be used with nodegroup ng-1',
      default: 't3.medium',
    });
    const nodeAMIVersion = new CfnParameter(this, 'nodeAMIVersion', {
      type: 'String',
      default: '1.21.2-20210722',
      description: 'AMI version used for EKS Worker nodes https://docs.aws.amazon.com/eks/latest/userguide/eks-linux-ami-versions.html',
    });

    const userdataCommands = UserData.forLinux();
    userdataCommands.addCommands(
      `sudo yum install -y https://s3.${this.region}.amazonaws.com/amazon-ssm-${this.region}/latest/linux_amd64/amazon-ssm-agent.rpm`,
    );
    const multipart = new MultipartUserData();
    multipart.addPart(
      MultipartBody.fromUserData(userdataCommands),
    );

    const launchtemplate = new CfnLaunchTemplate(this, 'LaunchTemplate', {
      launchTemplateData: {
        instanceType: nodeType.valueAsString,
        userData: Fn.base64(multipart.render()),
        blockDeviceMappings: [
          {
            deviceName: '/dev/xvda',
            ebs: {
              encrypted: true,
              volumeType: 'gp3',
            },
          },
        ],
        metadataOptions: {
          httpTokens: 'optional',
          httpPutResponseHopLimit: 2,

        },
        tagSpecifications: [{
          resourceType: 'instance',
          tags: [
            {
              key: 'Name',
              value: Fn.join('-', [props.eksCluster.clusterName, 'WorkerNodes']),
            },
          ],
        }],
      },
      launchTemplateName: Fn.join('-', ['ng-1', props.eksCluster.clusterName]),

    });
    props.nodeGroupRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    (() => new Nodegroup(this, 'ng-1', {
      cluster: props.eksCluster,
      releaseVersion: nodeAMIVersion.valueAsString,
      nodegroupName: 'ng-1',
      nodeRole: props.nodeGroupRole,
      maxSize: nodegroupMax.valueAsNumber,
      desiredSize: nodegroupCount.valueAsNumber,
      minSize: nodegroupMin.valueAsNumber,
      launchTemplateSpec: {
        id: launchtemplate.ref,
        version: launchtemplate.attrLatestVersionNumber,
      },
      tags: {
        Name: Fn.join('-', [props.eksCluster.clusterName, 'WorkerNodes']),
      },
    }))();
    props.nodeGroupRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
  }
}
