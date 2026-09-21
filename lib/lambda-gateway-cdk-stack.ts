import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as apigateway_integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'

export class LambdaGatewayCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      description: 'Prueba CDK con Lambda - No Home'
    });

    const commonlambdaProps = {
      runtime:lambda.Runtime.NODEJS_24_X,
      handler:'handler',
      timeout: cdk.Duration.seconds(30),
      bundling: {
          minify: true,
          externalModules: ["aws-sdk"],
        },
    };

    const exampleLambda01 = new NodejsFunction(this, 'ExampleLambda',{
      functionName:'jrg-lambda01-gateway01-cdk-demo03',
      entry: path.join(__dirname, '../src/lambda/lambdaMessage.ts'),
      ...commonlambdaProps,
    });

    new cdk.CfnOutput(this, 'LambdaARNNoHome', {
      value: exampleLambda01.functionArn,
      description: 'ARN function Lambda'
    });

    const exampleLambdaGateway01 = new NodejsFunction(this, 'ExampleLambdaGateway01',{
      functionName:'jrg-lambda-gateway001-cdk-demo03',
      entry: path.join(__dirname, '../src/lambda/lambdaGatewayPostToGet.ts'),
      ...commonlambdaProps,
    })

    const exampleLambdaGateway02 = new NodejsFunction(this, 'ExampleLambdaGateway02',{
      functionName: 'jrg-lambda-gateway002-cdk-demo03',
      entry: path.join(__dirname, '../src/lambda/lambdaGatewayPostToPost.ts'),
      ...commonlambdaProps
,    })

    const API = new apigateway.RestApi(this, 'MiAPIRest',{
      restApiName:'jrg-api-gateway01-cdk-demo03',
      description:'API Gateway para Lambda - No Home'
    });

     const exampleLambdaGateway01Resource = API.root.addResource('findPokemonByName');
     const lambdaIntegration01 = new apigateway.LambdaIntegration(exampleLambdaGateway01);
     exampleLambdaGateway01Resource.addMethod('POST',lambdaIntegration01, {});

     const exampleLambdaGateway02Resource = API.root.addResource('postToPost');
     const lambdaIntegration02 = new apigateway.LambdaIntegration(exampleLambdaGateway02);
     exampleLambdaGateway02Resource.addMethod('POST',lambdaIntegration02, {});

  }
}
