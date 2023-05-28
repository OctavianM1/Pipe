import { Stack } from 'aws-cdk-lib';
import {
  GatewayVpcEndpointAwsService,
  Vpc,
  FlowLogTrafficType,
  FlowLogDestination,
  InterfaceVpcEndpoint,
} from 'aws-cdk-lib/aws-ec2';

export function addEndpoint (stack: Stack, vpc: Vpc): void {
  (() => new InterfaceVpcEndpoint(stack, 'ecrapiVpcEndpoint', {
    open: true,
    vpc: vpc,
    service: {
      name: `com.amazonaws.${stack.region}.ecr.api`,
      port: 443,
    },
    privateDnsEnabled: true,
  }))();

  (() => new InterfaceVpcEndpoint(stack, 'ecradkrVpcEndpoint', {
    open: true,
    vpc: vpc,
    service: {
      name: `com.amazonaws.${stack.region}.ecr.dkr`,
      port: 443,
    },
    privateDnsEnabled: true,
  }))();
}

export const eksVpc = {
  cidr: '10.0.0.0/16',
  maxAzs: 3,
  gatewayEndpoints: {
    S3: {
      service: GatewayVpcEndpointAwsService.S3,
    },

  },
  flowLogs: {
    VpcFlowlogs: {
      destination: FlowLogDestination.toCloudWatchLogs(),
      trafficType: FlowLogTrafficType.ALL,
    },
  },
  natGateways: 2,
};
