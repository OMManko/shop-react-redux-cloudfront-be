import type { AWS } from '@serverless/typescript';

import { getProductsList } from '@functions/getProductsList';
import { getProductById } from '@functions/getProductById';
import { createProduct } from '@functions/createProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
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
      PRODUCTS_LIST_TABLE: '${self:custom.productsListTable}',
    },
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: [
            'dynamodb:DescribeTable',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
          ],
          Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.PRODUCTS_LIST_TABLE}'
        }],
      },
    },
  },
  functions: { getProductsList, getProductById, createProduct },
  package: { individually: true },
  custom: {
    productsListTable: '${self:service}-products-list-table-${opt:stage, self:provider.stage}',
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
    autoswagger: {
      apiType: 'http',
      basePath: '/${sls:stage}'
    },
    dynamodb:{
      start:{
        inMemory: true,
        migrate: true,
      },
      stages: 'dev'
    }
  },
  resources: {
    Resources: {
      ProductsListTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.PRODUCTS_LIST_TABLE}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            }
          ],
          KeySchema: [{
            AttributeName: 'id',
            KeyType: 'HASH'
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        },
      }
    }
  }
};

module.exports = serverlessConfiguration;
