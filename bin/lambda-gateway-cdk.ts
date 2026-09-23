#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { LambdaGatewayCdkStack } from '../lib/lambda-gateway-cdk-stack';
import { BuildConfig } from '../config/buildConfig'

const app = new cdk.App();
const nameStackApplication = 'lambda-gateway-cdk';
  
const stage = app.node.tryGetContext('stage') || 'dev';
const region = app.node.tryGetContext('region') || 'us-west-2';

const buildConfig = new BuildConfig(nameStackApplication, stage);
const config = buildConfig.getConfig();

new LambdaGatewayCdkStack(app, `${nameStackApplication}-${stage}`, {
  env: {region},
  config,
});  
