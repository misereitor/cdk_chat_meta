import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { policies } from '../policies/policies';
import * as iam from 'aws-cdk-lib/aws-iam';
import { environment } from '../lambda/config/env/config';

export class CdkChatMetaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const iamROle = new iam.Role(this, 'metaChatRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('scheduler.amazonaws.com'),
        new iam.ServicePrincipal('events.amazonaws.com'),
        new iam.ServicePrincipal('cloudformation.amazonaws.com')
      ),
      roleName: 'metaChatRole'
    });

    policies.forEach((policy) => {
      const policyStatement = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: Array.isArray(policy.Action) ? policy.Action : [policy.Action],
        resources: Array.isArray(policy.Resource)
          ? policy.Resource
          : [policy.Resource]
      });
      iamROle.addToPolicy(policyStatement);
    });

    const lambdaWebhookMeta = new lambda.Function(this, 'webhookmeta', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda', {
        exclude: ['dist', 'node_modules']
      }),
      environment: environment,
      handler: 'src/meta/webhook/webhook.handler',
      role: iamROle,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      retryAttempts: 0
    });

    lambdaWebhookMeta.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });
  }
}
