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
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            BUCKET_NAME: '${self:custom.bucketName}',
            BUCKET_REGION: '${self:provider.region}',
            UPLOAD_FOLDER: 'uploaded',
            PARSED_FOLDER: 'parsed',
            REGION: '${self:provider.region}',
            SQS_URL: {
                'Fn::ImportValue': '${self:custom.stackName}-CatalogItemsQueueUrl'
            },
            SQS_ARN: {
                'Fn::ImportValue': '${self:custom.stackName}-CatalogItemsQueueArn'
            }
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
                    },
                    {
                        Effect: 'Allow',
                        Action: 'sqs:*',
                        Resource: '${self:provider.environment.SQS_ARN}'
                    }
                ]
            }
        }
    },
    functions: { importProductsFile, importFileParser },
    package: { individually: true },
    custom: {
        bucketName: '${self:service}-upload-${opt:stage, self:provider.stage}',
        stackName: 'product-service-dev',
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10
        }
    }
};

module.exports = serverlessConfiguration;
