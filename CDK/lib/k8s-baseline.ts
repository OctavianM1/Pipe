import * as fs from 'fs';
import { CfnCondition, CfnParameter, CfnResource, Fn } from 'aws-cdk-lib';
import { Cluster, HelmChart, KubernetesManifest, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import * as yaml from 'js-yaml';
import * as genPolicy from './policies/policies';

interface k8sBaselineProps extends cdk.StackProps {
  eksCluster: Cluster,
}

export class K8sBaselineStack extends cdk.Stack {
  constructor(scope: Construct,
    id: string,
    props: k8sBaselineProps) {
    super(scope, id, props);

    const ebsDriver = new CfnParameter(this, 'ebsDriver', {
      type: 'String',
      default: 'false',
      description: 'Deploy EBS CSI Driver',
      allowedValues: ['true', 'false'],
    });
    const albDriver = new CfnParameter(this, 'albDriver', {
      type: 'String',
      default: 'true',
      description: 'Deploy Application Load Balancer Ingress ',
      allowedValues: ['true', 'false'],
    });
    const efsDriver = new CfnParameter(this, 'efsDriver', {
      type: 'String',
      default: 'false',
      description: 'Deploy EFS CSI Driver',
      allowedValues: ['true', 'false'],
    });

    const fluentBitDriver = new CfnParameter(this, 'fluentBit', {
      type: 'String',
      default: 'true',
      description: 'Deploy FluentBit Log Collection Driver',
      allowedValues: ['true', 'false'],
    });
    const secretsDriver = new CfnParameter(this, 'secretsDriver', {
      type: 'String',
      default: 'false',
      description: 'Deploy AWS Secrets CSI Driver',
      allowedValues: ['true', 'false'],
    });

    const networkPolicyEngineDriver = new CfnParameter(this, 'networkPolicyEngine', {
      type: 'String',
      default: 'false',
      description: 'Deploy Calico Network Policy Engine Driver',
      allowedValues: ['true', 'false'],
    });

    const clusterAutoscalerDriver = new CfnParameter(this, 'clusterAutoscaler', {
      type: 'String',
      default: 'true',
      description: 'Deploy Cluster Autoscaler',
      allowedValues: ['true', 'false'],
    });
    const containerInsightsDriver = new CfnParameter(this, 'containerInsights', {
      type: 'String',
      default: 'false',
      description: 'Deploy Container Insights',
      allowedValues: ['true', 'false'],
    });
    const metricServerDriver = new CfnParameter(this, 'metricServer', {
      type: 'String',
      default: 'true',
      description: 'Deploy Metric Server',
      allowedValues: ['true', 'false'],
    });

    const ebsDriverCondition = new CfnCondition(this, 'ebsDriverCondition', {
      expression: Fn.conditionEquals(ebsDriver.valueAsString, 'true'),
    });

    const albDriverCondition = new CfnCondition(this, 'albDriverCondition', {
      expression: Fn.conditionEquals(albDriver.valueAsString, 'true'),
    });
    const efsDriverCondition = new CfnCondition(this, 'efsDriverCondition', {
      expression: Fn.conditionEquals(efsDriver.valueAsString, 'true'),
    });
    const fluentBitDriverCondition = new CfnCondition(this, 'fluentBitDriverCondition', {
      expression: Fn.conditionEquals(fluentBitDriver.valueAsString, 'true'),
    });
    const secretsDriverCondition = new CfnCondition(this, 'secretsDriverCondition', {
      expression: Fn.conditionEquals(secretsDriver.valueAsString, 'true'),
    });
    const networkPolicyDriverCondition = new CfnCondition(this, 'networkPolicyEngineDriverCondition', {
      expression: Fn.conditionEquals(networkPolicyEngineDriver.valueAsString, 'true'),
    });
    const clusterAutoscalerDriverCondition = new CfnCondition(this, 'clusterAutoscalerDriverCondition', {
      expression: Fn.conditionEquals(clusterAutoscalerDriver.valueAsString, 'true'),
    });
    const containerInsightsDriverCondition = new CfnCondition(this, 'containerInsightsDriverCondition', {
      expression: Fn.conditionEquals(containerInsightsDriver.valueAsString, 'true'),
    });
    const metricServerDriverCondition = new CfnCondition(this, 'metricServerDriverCondition', {
      expression: Fn.conditionEquals(metricServerDriver.valueAsString, 'true'),
    });

    const clusterAutoscalerSA = new ServiceAccount(this, 'clusterAutoscalerSA', {
      name: 'cluster-autoscaler-sa',
      cluster: props.eksCluster,
      namespace: 'kube-system',
    });
    this.addConditions(clusterAutoscalerSA, clusterAutoscalerDriverCondition);
    const clusterAutoscalerDeploy = new HelmChart(this, 'clusterautoscaler-deploy', {
      repository: 'https://kubernetes.github.io/autoscaler',
      release: 'cluster-autoscaler',
      cluster: props.eksCluster,
      chart: 'cluster-autoscaler',
      namespace: 'kube-system',
      wait: true,
      version: this.node.tryGetContext('cluster-autoscaler-helm-version'),
      values: {
        cloudProvider: 'aws',
        awsRegion: this.region,
        autoDiscovery: {
          clusterName: props.eksCluster.clusterName,
        },
        rbac: {
          serviceAccount: {
            create: false,
            name: clusterAutoscalerSA.serviceAccountName,
          },
        },
        extraArgs: {
          'skip-nodes-with-system-pods': false,
          'skip-nodes-with-local-storage': false,
          'balance-similar-node-groups': true,
          'scale-down-unneeded-time': '300s',
          'scale-down-delay-after-add': '300s',
        },

      },
    });
    const clusterAutoscalerPolicy = genPolicy.createClusterAutoscalerPolicy(this, props.eksCluster.clusterName, clusterAutoscalerSA.role);
    this.addConditions(clusterAutoscalerDeploy, clusterAutoscalerDriverCondition);
    this.addConditions(clusterAutoscalerPolicy, clusterAutoscalerDriverCondition);
  
    const manifestFluentBitSetup = this.cleanManifest('manifests/fluentBitSetup.yaml');
    const fluentBitNamespace = new KubernetesManifest(this, 'amazon-cloudwatch-namespace', {
      cluster: props.eksCluster,
      manifest: [{
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          name: 'amazon-cloudwatch',
          labels: {
            name: 'amazon-cloudwatch',
          },
        },
      }],
    });
    this.addConditions(fluentBitNamespace, fluentBitDriverCondition);
    const fluentBitSA = new ServiceAccount(this, 'fluentbit-sa', {
      name: 'fluent-bit',
      namespace: 'amazon-cloudwatch',
      cluster: props.eksCluster,
    });
    fluentBitSA.node.addDependency(fluentBitNamespace);
    const fluentbitPolicy = genPolicy.createFluentbitPolicy(this, props.eksCluster.clusterName, fluentBitSA.role);
    this.addConditions(fluentbitPolicy, fluentBitDriverCondition);
    this.addConditions(fluentBitSA, fluentBitDriverCondition);
    const fluentBitClusterInfo = new KubernetesManifest(this, 'fluentbit-cluster-info', {
      cluster: props.eksCluster,
      manifest: [{
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
          name: 'fluent-bit-cluster-info',
          namespace: 'amazon-cloudwatch',
          labels: {
            name: 'fluent-bit-cluster-info',
          },
        },
        data: {
          'cluster.name': props.eksCluster.clusterName,
          'http.port': '2020',
          'http.server': 'On',
          'logs.region': this.region,
          'read.head': 'Off',
          'read.tail': 'On',
        },

      }],

    });
    fluentBitClusterInfo.node.addDependency(fluentBitNamespace);
    this.addConditions(fluentBitClusterInfo, fluentBitDriverCondition);
    const fluentBitResource = new KubernetesManifest(this, 'fluentbit-resource', {
      cluster: props.eksCluster,
      manifest: manifestFluentBitSetup,
    });
    fluentBitResource.node.addDependency(fluentBitSA);
    fluentBitResource.node.addDependency(fluentBitClusterInfo);
    this.addConditions(fluentBitResource, fluentBitDriverCondition);


    const albNamespace = new KubernetesManifest(this, 'alb-ingress-controller-namespace', {
      cluster: props.eksCluster,
      manifest: [{
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          name: 'alb-ingress-controller',
          labels: {
            name: 'alb-ingress-controller',
          },
        },
      }],
    });
    const albSA = new ServiceAccount(this, 'alb-ingress-controller-sa', {
      name: 'alb-ingress-controller-sa',
      namespace: 'alb-ingress-controller',
      cluster: props.eksCluster,
    });
    this.addConditions(albNamespace, albDriverCondition);
    albSA.node.addDependency(albNamespace);
    this.addConditions(albSA, albDriverCondition);

    const albIamTest = genPolicy.createAlbIngressPolicy(this, props.eksCluster.clusterName, albSA.role);
    this.addConditions(albIamTest, albDriverCondition);
    const albIngressHelmChart = new HelmChart(this, 'alb-ingress-controller-chart', {
      chart: 'aws-load-balancer-controller',
      cluster: props.eksCluster,
      repository: 'https://aws.github.io/eks-charts',
      wait: true,
      release: 'aws-load-balancer-controller',
      createNamespace: true,
      namespace: 'alb-ingress-controller',
      version: this.node.tryGetContext('aws-load-balancer-controller-helm-version'),
      values: {
        clusterName: props.eksCluster.clusterName,
        defaultTags: {
          'eks:cluster-name': props.eksCluster.clusterName,
        },
        region: this.region,
        vpcId: props.eksCluster.vpc.vpcId,
        serviceAccount: {
          create: false,
          name: albSA.serviceAccountName,
        },
      },
    });
    albIngressHelmChart.node.addDependency(albSA);
    this.addConditions(albIngressHelmChart, albDriverCondition);

    const ebsSA = new ServiceAccount(this, 'ebs-csi-controller-sa', {
      name: 'ebs-csi-controller-sa',
      namespace: 'kube-system',
      cluster: props.eksCluster,
    });
    this.addConditions(ebsSA, ebsDriverCondition);

    const ebsIamPolicyTest = genPolicy.createEBSPolicy(this, props.eksCluster.clusterName, ebsSA.role);
    this.addConditions(ebsIamPolicyTest, ebsDriverCondition);
    const ebsCsiHelmChart = new HelmChart(this, 'ebs-csi-helm-chart', {
      chart: 'aws-ebs-csi-driver',
      cluster: props.eksCluster,
      createNamespace: true,
      repository: 'https://kubernetes-sigs.github.io/aws-ebs-csi-driver',
      release: 'aws-ebs-csi-driver',
      namespace: 'kube-system',
      wait: true,
      version: this.node.tryGetContext('aws-ebs-csi-driver-helm-version'),
      values: {
        controller: {
          serviceAccount: {
            create: false,
            name: ebsSA.serviceAccountName,
          },
          extraVolumeTags: {
            'eks:cluster-name': props.eksCluster.clusterName,
          },
        },

      },

    });

    ebsCsiHelmChart.node.addDependency(ebsSA);
    this.addConditions(ebsCsiHelmChart, ebsDriverCondition);

   

    const efsSA = new ServiceAccount(this, 'efs-csi-controller-sa', {
      name: 'efs-csi-controller-sa',
      namespace: 'kube-system',
      cluster: props.eksCluster,
    });
    this.addConditions(efsSA, efsDriverCondition);

    const efsPolicy = genPolicy.createEFSPolicy(this, props.eksCluster.clusterName, efsSA.role);
    this.addConditions(efsPolicy, efsDriverCondition);
    const efsCsiHelmChart = new HelmChart(this, 'efs-csi-helm-chart', {
      chart: 'aws-efs-csi-driver',
      cluster: props.eksCluster,
      createNamespace: true,
      repository: 'https://kubernetes-sigs.github.io/aws-efs-csi-driver',
      release: 'aws-efs-csi-driver',
      namespace: 'kube-system',
      wait: true,
      version: this.node.tryGetContext('aws-efs-csi-driver-helm-version'),
      values: {
        controller: {
          logLevel: 10,
          serviceAccount: {
            create: false,
            name: efsSA.serviceAccountName,
          },
          tags: {
            'eks/cluster-name': props.eksCluster.clusterName,
          },
        },

      },

    });

    efsCsiHelmChart.node.addDependency(efsSA);
    this.addConditions(efsCsiHelmChart, efsDriverCondition);

    const awsSecretSa = new ServiceAccount(this, 'aws-secrets-sa', {
      cluster: props.eksCluster,
      name: 'csi-secrets-store-provider-aws',
      namespace: 'kube-system',
    });

    this.addConditions(awsSecretSa, secretsDriverCondition);

    const secretsCsiHelmChart = new HelmChart(this, 'secrets-csi-helm-chart', {
      chart: 'secrets-store-csi-driver',
      cluster: props.eksCluster,
      createNamespace: true,
      repository: 'https://raw.githubusercontent.com/kubernetes-sigs/secrets-store-csi-driver/master/charts',
      release: 'csi-secrets-store',
      namespace: 'kube-system',
      wait: true,
      version: this.node.tryGetContext('secrets-store-csi-helm-version'),
      values: {
        grpcSupportedProviders: 'aws',
      },

    });

    this.addConditions(secretsCsiHelmChart, secretsDriverCondition);
    const awsSecretsManifest = this.cleanManifest('manifests/awsSecretsManifest.yaml');
    const awsSecretsManifestDeploy = new KubernetesManifest(this, 'aws-secrets-manifest', {
      cluster: props.eksCluster,
      manifest: awsSecretsManifest,
    });

    awsSecretsManifestDeploy.node.addDependency(secretsCsiHelmChart);
    this.addConditions(awsSecretsManifestDeploy, secretsDriverCondition);

    const calicoPolicyEngine = new HelmChart(this, 'calico-policy-engine', {
      chart: 'aws-calico',
      cluster: props.eksCluster,
      createNamespace: true,
      repository: 'https://aws.github.io/eks-charts',
      release: 'aws-calico',
      namespace: 'kube-system',
      wait: true,
      version: this.node.tryGetContext('aws-calico-helm-version'),
      values: {
        calico: {
          node: {
            logseverity: 'Debug',
            resources: {
              limits: {
                memory: '256Mi',
                cpu: '500m',
              },
            },
          },
        },
      },

    });
    this.addConditions(calicoPolicyEngine, networkPolicyDriverCondition);

    const containerInsightsNamespace = new KubernetesManifest(this, 'container-insights-namespace', {
      cluster: props.eksCluster,
      manifest: [{
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          name: 'aws-otel-eks',
          labels: {
            name: 'aws-otel-eks',
          },
        },
      }],
    });
    this.addConditions(containerInsightsNamespace, containerInsightsDriverCondition);

    const containerInsightsSA = new ServiceAccount(this, 'container-insights-sa', {
      name: 'aws-otel-sa',
      namespace: 'aws-otel-eks',
      cluster: props.eksCluster,
    });
    containerInsightsSA.role.addManagedPolicy(ManagedPolicy.fromManagedPolicyArn(this, 'CloudWatchAgentServerPolicyManaged', 'arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy'));
    this.addConditions(containerInsightsSA, containerInsightsDriverCondition);

    containerInsightsSA.node.addDependency(containerInsightsNamespace);
    const manifestcontainerInsightsSetup = this.cleanManifest('manifests/otelContainerInsights.yaml');
    const containerInsightsDeploy = new KubernetesManifest(this, 'container-insights-deploy', {
      cluster: props.eksCluster,
      manifest: [
        ...manifestcontainerInsightsSetup,
      ],
    });
    containerInsightsDeploy.node.addDependency(containerInsightsSA);
    this.addConditions(containerInsightsDeploy, containerInsightsDriverCondition);

    const manifestMetricServer = yaml.loadAll(fs.readFileSync('manifests/metricServerManifest.yaml', 'utf-8'), null, { schema: yaml.JSON_SCHEMA });
    const metricServerManifestDeploy = new KubernetesManifest(this, 'metric-server', {
      cluster: props.eksCluster,
      manifest: [
        ...manifestMetricServer,
      ],
    });
    this.addConditions(metricServerManifestDeploy, metricServerDriverCondition);
  }

  addConditions(resource: IConstruct, cond: CfnCondition) {
    if (resource.node.defaultChild !== undefined && resource.node.defaultChild.constructor.name.match(/^Cfn+/)) {
      (resource.node.defaultChild as CfnResource).cfnOptions.condition = cond;
    } else {
      resource.node.children.forEach(node => {
        this.addConditions(node, cond);
      });
    }
  }

  cleanManifest(file: string) {
    const manifest = yaml.loadAll(fs.readFileSync(file, 'utf-8'), null, { schema: yaml.JSON_SCHEMA });
    return manifest.filter(element => (element.kind !== 'Namespace' && element.kind !== 'ServiceAccount'));
  }
}
