import { Policy, PolicyStatement, IRole } from 'aws-cdk-lib/aws-iam';
import { CfnJson, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export function createFluentbitPolicy(stack: Stack, clusterName: string, roleSA: IRole): Policy {
  const fluentBitSaRoleStatementPolicy = new PolicyStatement({
    resources: [
      `arn:aws:logs:${stack.region}:${stack.account}:log-group:/aws/containerinsights/${clusterName}/*`,
      `arn:aws:logs:${stack.region}:${stack.account}:log-group:/aws/containerinsights/${clusterName}/*:log-stream:*`,
    ],
    actions: [
      'logs:CreateLogStream',
      'logs:CreateLogGroup',
      'logs:DescribeLogStreams',
      'logs:PutLogEvents',
    ],
  });
  return new Policy(stack, 'fluentBitSaRolePolicy', {
    roles: [
      roleSA,
    ],
    statements: [
      fluentBitSaRoleStatementPolicy,
    ],
  });
}
export function createClusterAutoscalerPolicy(stack: Construct, clusterName: string, roleSA: IRole): Policy {
  const clusterAutoscalerSAPolicyStatementDescribe = new PolicyStatement({
    resources: [
      '*',
    ],
    actions: [
      'autoscaling:DescribeAutoScalingGroups',
      'autoscaling:DescribeAutoScalingInstances',
      'autoscaling:DescribeLaunchConfigurations',
      'autoscaling:DescribeTags',
      'ec2:DescribeLaunchTemplateVersions',
    ],

  });
  const clusterAutoscalerPolicyStatementWriteJson = new CfnJson(stack, 'clusterAutoscalerPolicyStatementWriteJson', {
    value: {
      'autoscaling:ResourceTag/k8s.io/cluster-autoscaler/enabled': 'true',
      [`autoscaling:ResourceTag/kubernetes.io/cluster/${clusterName}`]: 'owned',
    },
  });
  const clusterAutoscalerPolicyStatementWrite = new PolicyStatement({
    resources: [
      '*',
    ],
    actions: [
      'autoscaling:SetDesiredCapacity',
      'autoscaling:TerminateInstanceInAutoScalingGroup',
      'autoscaling:UpdateAutoScalingGroup',
    ],
    conditions: {
      StringEquals: clusterAutoscalerPolicyStatementWriteJson,
    },
  },
  );
  return new Policy(stack, 'clusterAutoscalerPolicy', {
    statements: [
      clusterAutoscalerPolicyStatementWrite,
      clusterAutoscalerSAPolicyStatementDescribe,
    ],
    roles: [
      roleSA,
    ],
  });
}

export function createEFSPolicy(stack: Stack, clusterName: string, roleSA: IRole): Policy {
  const readEFSResources = new PolicyStatement({
    resources: [
      '*',
    ],
    actions: [
      'elasticfilesystem:DescribeFileSystems',
      'elasticfilesystem:DescribeMountTargets',
    ],
  });
  const writeEFSResourcesRequest = new PolicyStatement({
    resources: [
      '*',
    ],
    actions: [
      'elasticfilesystem:CreateAccessPoint',
    ],
    conditions: {
      StringEquals: {
        'aws:RequestTag/eks/cluster-name': clusterName,
      },
    },
  });
  const writeEFSResourcesResource = new PolicyStatement({
    resources: [
      '*',
    ],
    actions: [
      'elasticfilesystem:DeleteAccessPoint',
    ],
    conditions: {
      StringEquals: {
        'aws:ResourceTag/eks/cluster-name': clusterName,
      },
    },
  });
  return new Policy(stack, 'efsPolicy', {
    roles: [
      roleSA,
    ],
    statements: [
      readEFSResources,
      writeEFSResourcesRequest,
      writeEFSResourcesResource,
    ],
  });
}

export function createEBSPolicy(stack: Stack, clusterName: string, roleSA: IRole): Policy {
  const readEBSPolicy = new PolicyStatement({
    resources: [
      '*',
    ],
    actions: [
      'ec2:DescribeAvailabilityZones',
      'ec2:DescribeInstances',
      'ec2:DescribeSnapshots',
      'ec2:DescribeTags',
      'ec2:DescribeVolumes',
      'ec2:DescribeVolumesModifications',
    ],
  });
  const createTags = new PolicyStatement({
    resources: [
      `arn:aws:ec2:${stack.region}:${stack.account}:volume/*`,
      `arn:aws:ec2:${stack.region}:${stack.account}:snapshot/*`,
    ],
    conditions: {
      StringEquals: {
        'ec2:CreateAction': [
          'CreateVolume',
          'CreateSnapshot',
        ],
      },
    },
    actions: [
      'ec2:CreateTags',
    ],
  });
  const deleteTags = new PolicyStatement({
    resources: [
      `arn:aws:ec2:${stack.region}:${stack.account}:volume/*`,
      `arn:aws:ec2:${stack.region}:${stack.account}:snapshot/*`,
    ],
    conditions: {
      StringEquals: {
        'aws:ResourceTag/eks:cluster-name': clusterName,
      },
    },
    actions: [
      'ec2:DeleteTags',
    ],
  });
  const modifyVolume = new PolicyStatement({
    resources: [
      `arn:aws:ec2:${stack.region}:${stack.account}:instance/*`,
      `arn:aws:ec2:${stack.region}:${stack.account}:volume/*`,
    ],
    actions: [
      'ec2:AttachVolume',
      'ec2:DetachVolume',
      'ec2:ModifyVolume',
    ],
    conditions: {
      StringEquals: {
        'aws:ResourceTag/eks:cluster-name': clusterName,
      },
    },
  });
  const createVolume = new PolicyStatement({
    resources: [
      '*',
    ],
    conditions: {
      StringEquals: {
        'aws:RequestTag/eks:cluster-name': clusterName,
      },
    },
    actions: [
      'ec2:CreateVolume',
    ],
  });
  const deleteVolume = new PolicyStatement({
    resources: [
      '*',
    ],
    conditions: {
      StringEquals: {
        'aws:ResourceTag/eks:cluster-name': clusterName,
      },
    },
    actions: [
      'ec2:DeleteVolume',
      'ec2:DetachVolume',
      'ec2:AttachVolume',
      'ec2:ModifyVolume',
    ],
  });
  const createSnapshot = new PolicyStatement({
    resources: [
      '*',
    ],
    conditions: {
      StringEquals: {
        'aws:RequestTag/eks:cluster-name': clusterName,
      },
    },
    actions: [
      'ec2:CreateSnapshot',
    ],
  });
  const deleteSnapshot = new PolicyStatement({
    resources: [
      '*',
    ],
    conditions: {
      StringEquals: {
        'aws:ResourceTag/eks:cluster-name': clusterName,
      },
    },
    actions: [
      'ec2:DeleteSnapshot',
    ],
  });
  return new Policy(stack, 'ebsDriverPolicy', {
    roles: [
      roleSA,
    ],
    statements: [
      readEBSPolicy,
      createTags,
      deleteTags,
      createVolume,
      deleteVolume,
      modifyVolume,
      createSnapshot,
      deleteSnapshot,
    ],
  });
}

export function createAlbIngressPolicy(stack: Stack, clusterName: string, roleSA: IRole): Policy {
  const serviceLinkedRole = new PolicyStatement({
    actions: [
      'iam:CreateServiceLinkedRole',
    ],
    resources: ['*'],
    conditions: {
      StringEquals: {
        'iam:AWSServiceName': 'elasticloadbalancing.amazonaws.com',
      },
    },
  });
  const readPolicy = new PolicyStatement({
    actions: [
      'ec2:DescribeAccountAttributes',
      'ec2:DescribeAddresses',
      'ec2:DescribeAvailabilityZones',
      'ec2:DescribeInternetGateways',
      'ec2:DescribeVpcs',
      'ec2:DescribeSubnets',
      'ec2:DescribeSecurityGroups',
      'ec2:DescribeInstances',
      'ec2:DescribeNetworkInterfaces',
      'ec2:DescribeTags',
      'ec2:GetCoipPoolUsage',
      'ec2:DescribeCoipPools',
      'elasticloadbalancing:DescribeLoadBalancers',
      'elasticloadbalancing:DescribeLoadBalancerAttributes',
      'elasticloadbalancing:DescribeListeners',
      'elasticloadbalancing:DescribeListenerCertificates',
      'elasticloadbalancing:DescribeSSLPolicies',
      'elasticloadbalancing:DescribeRules',
      'elasticloadbalancing:DescribeTargetGroups',
      'elasticloadbalancing:DescribeTargetGroupAttributes',
      'elasticloadbalancing:DescribeTargetHealth',
      'elasticloadbalancing:DescribeTags',
    ],
    resources: ['*'],
  });
  const readPolicyAdd = new PolicyStatement({
    actions: [
      'cognito-idp:DescribeUserPoolClient',
      'acm:ListCertificates',
      'acm:DescribeCertificate',
      'iam:ListServerCertificates',
      'iam:GetServerCertificate',
      'waf-regional:GetWebACL',
      'waf-regional:GetWebACLForResource',
      'waf-regional:AssociateWebACL',
      'waf-regional:DisassociateWebACL',
      'wafv2:GetWebACL',
      'wafv2:GetWebACLForResource',
      'wafv2:AssociateWebACL',
      'wafv2:DisassociateWebACL',
      'shield:GetSubscriptionState',
      'shield:DescribeProtection',
      'shield:CreateProtection',
      'shield:DeleteProtection',
    ],
    resources: ['*'],
  });
  const writeSG = new PolicyStatement({
    actions: [
      'ec2:AuthorizeSecurityGroupIngress',
      'ec2:RevokeSecurityGroupIngress',
    ],
    resources: ['*'],
  });
  const createSG = new PolicyStatement({

    actions: [
      'ec2:CreateSecurityGroup',
    ],
    resources: ['*'],
  });
  const createTags = new PolicyStatement({

    actions: [
      'ec2:CreateTags',
    ],
    resources: ['arn:aws:ec2:*:*:security-group/*'],
    conditions: {
      StringEquals: {
        'ec2:CreateAction': 'CreateSecurityGroup',
      },
      Null: {
        'aws:RequestTag/elbv2.k8s.aws/cluster': 'false',
      },
    },
  });
  const createdeleteTags = new PolicyStatement({

    actions: [
      'ec2:CreateTags',
      'ec2:DeleteTags',
    ],
    resources: ['arn:aws:ec2:*:*:security-group/*'],
    conditions: {
      Null: {
        'aws:RequestTag/elbv2.k8s.aws/cluster': 'true',
        'aws:ResourceTag/elbv2.k8s.aws/cluster': 'false',
      },
    },
  });
  const writeSGIngress = new PolicyStatement({

    actions: [
      'ec2:AuthorizeSecurityGroupIngress',
      'ec2:RevokeSecurityGroupIngress',
      'ec2:DeleteSecurityGroup',
    ],
    resources: ['*'],
    conditions: {
      Null: {
        'aws:ResourceTag/elbv2.k8s.aws/cluster': 'false',
      },
    },
  });
  const createLoadBalancer = new PolicyStatement({

    actions: [
      'elasticloadbalancing:CreateLoadBalancer',
      'elasticloadbalancing:CreateTargetGroup',
    ],
    resources: ['*'],
    conditions: {
      StringEquals: {
        'aws:RequestTag/eks:cluster-name': clusterName,
      },
    },
  });
  const createLoadBalancerAdd = new PolicyStatement({

    actions: [
      'elasticloadbalancing:CreateListener',
      'elasticloadbalancing:DeleteListener',
      'elasticloadbalancing:CreateRule',
      'elasticloadbalancing:DeleteRule',
    ],
    resources: ['*'],
  });
  const loadBalancerTags = new PolicyStatement(
    {

      actions: [
        'elasticloadbalancing:AddTags',
        'elasticloadbalancing:RemoveTags',
      ],
      resources: [
        'arn:aws:elasticloadbalancing:*:*:targetgroup/*/*',
        'arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*',
        'arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*',
      ],
      conditions: {
        Null: {
          'aws:RequestTag/elbv2.k8s.aws/cluster': 'true',
          'aws:ResourceTag/elbv2.k8s.aws/cluster': 'false',
        },
      },
    });
  const loadBalancerListenersTags = new PolicyStatement({

    actions: [
      'elasticloadbalancing:AddTags',
      'elasticloadbalancing:RemoveTags',
    ],
    resources: [
      'arn:aws:elasticloadbalancing:*:*:listener/net/*/*/*',
      'arn:aws:elasticloadbalancing:*:*:listener/app/*/*/*',
      'arn:aws:elasticloadbalancing:*:*:listener-rule/net/*/*/*',
      'arn:aws:elasticloadbalancing:*:*:listener-rule/app/*/*/*',
    ],
  });
  const modifyLoadBalancer = new PolicyStatement({

    actions: [
      'elasticloadbalancing:ModifyLoadBalancerAttributes',
      'elasticloadbalancing:SetIpAddressType',
      'elasticloadbalancing:SetSecurityGroups',
      'elasticloadbalancing:SetSubnets',
      'elasticloadbalancing:ModifyTargetGroup',
      'elasticloadbalancing:ModifyTargetGroupAttributes',
    ],
    resources: ['*'],
    conditions: {
      Null: {
        'aws:ResourceTag/elbv2.k8s.aws/cluster': 'false',
      },
    },
  });
  const deleteLoadBalancer = new PolicyStatement({
    resources: ['*'],
    actions: [
      'elasticloadbalancing:DeleteTargetGroup',
      'elasticloadbalancing:DeleteLoadBalancer',
    ],
    conditions: {
      StringEquals: {
        'aws:ResourceTag/eks:cluster-name': clusterName,
      },
    },
  });
  const registerTarget = new PolicyStatement({

    actions: [
      'elasticloadbalancing:RegisterTargets',
      'elasticloadbalancing:DeregisterTargets',
    ],
    resources: ['arn:aws:elasticloadbalancing:*:*:targetgroup/*/*'],
  });
  const modifyLoadBalancerCerts = new PolicyStatement({

    actions: [
      'elasticloadbalancing:SetWebAcl',
      'elasticloadbalancing:ModifyListener',
      'elasticloadbalancing:AddListenerCertificates',
      'elasticloadbalancing:RemoveListenerCertificates',
      'elasticloadbalancing:ModifyRule',
    ],
    resources: ['*'],
  });

  return new Policy(stack, 'albIngressPolicy', {
    roles: [
      roleSA,
    ],
    statements: [
      modifyLoadBalancer,
      readPolicy,
      writeSG,
      createSG,
      readPolicyAdd,
      createTags,
      createdeleteTags,
      writeSGIngress,
      createLoadBalancer,
      loadBalancerTags,
      createLoadBalancerAdd,
      loadBalancerListenersTags,
      registerTarget,
      modifyLoadBalancer,
      modifyLoadBalancerCerts,
      deleteLoadBalancer,
      serviceLinkedRole,
    ],
  });
}
