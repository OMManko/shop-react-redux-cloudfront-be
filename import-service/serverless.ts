import type { AWS } from '@serverless/typescript';

import { importProductsFile } from '@functions/importProductsFile';
import { importFileParser } from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: '${self:custom.bucketName}',
      BUCKET_REGION: '${self:provider.region}',
      UPLOAD_FOLDER: 'uploaded',
      PARSED_FOLDER: 'parsed'
    },
    iam: {
      role: {
        statements: [
            {
              Effect: 'Allow',
              Action: 's3:ListBucket',
              Resource: 'arn:aws:s3:::${self:custom.bucketName}'
            },
            {
              Effect: 'Allow',
              Action: 's3:*',
              Resource: 'arn:aws:s3:::${self:custom.bucketName}/*'
            }
        ],
      },
    },
  },
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    bucketName: '${self:service}-upload-${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  }
};

module.exports = serverlessConfiguration;
