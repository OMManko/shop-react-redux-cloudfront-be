import type { AWS } from '@serverless/typescript';

import { getProductsList } from '@functions/getProductsList';
import { getProductById } from '@functions/getProductById';
import { createProduct } from '@functions/createProduct';
import { catalogBatchProcess } from '@functions/catalogBatchProcess';

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
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            PRODUCTS_LIST_TABLE: '${self:custom.productsListTable}',
            STOCK_TABLE: '${self:custom.stockTable}',
            CATALOG_ITEMS_QUEUE: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] },
            REGION: '${self:provider.region}',
            SQS_ARN: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] },
            SNS_ARN: {
                Ref: 'CreateProductTopic'
            }
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: [
                            'dynamodb:DescribeTable',
                            'dynamodb:Query',
                            'dynamodb:Scan',
                            'dynamodb:GetItem',
                            'dynamodb:PutItem',
                            'dynamodb:UpdateItem',
                            'dynamodb:DeleteItem'
                        ],
                        Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*'
                    },
                    {
                        Effect: 'Allow',
                        Action: 'sqs:*',
                        Resource: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] }
                    },
                    {
                        Effect: 'Allow',
                        Action: 'sns:*',
                        Resource: { Ref: 'CreateProductTopic' }
                    }
                ]
            }
        }
    },
    functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
    package: { individually: true },
    custom: {
        productsListTable: '${self:service}-products-list-table-${opt:stage, self:provider.stage}',
        stockTable: '${self:service}-stock-table-${opt:stage, self:provider.stage}',
        catalogItemsQueue:
            '${self:service}-catalogue-items-queue-${opt:stage, self:provider.stage}',
        createProductTopic:
            '${self:service}-create-product-topic-${opt:stage, self:provider.stage}',
        createProductSubscriptionEmail: 'volha.manko@gmail.com',
        createFilteredProductSubscriptionEmail: 'pavel.manko@gmail.com',
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10
        },
        autoswagger: {
            apiType: 'http',
            basePath: '/${sls:stage}'
        },
        dynamodb: {
            start: {
                inMemory: true,
                migrate: true
            },
            stages: 'dev'
        }
    },
    resources: {
        Resources: {
            ProductsListTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${self:custom.productsListTable}',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'S'
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH'
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            },
            StockTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${self:custom.stockTable}',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'product_id',
                            AttributeType: 'S'
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'product_id',
                            KeyType: 'HASH'
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            },
            CatalogItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: '${self:custom.catalogItemsQueue}'
                }
            },
            CreateProductTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: '${self:custom.createProductTopic}'
                }
            },
            CreateProductSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: '${self:custom.createProductSubscriptionEmail}',
                    TopicArn: { Ref: 'CreateProductTopic' }
                }
            },
            CreateFilteredProductSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: '${self:custom.createFilteredProductSubscriptionEmail}',
                    TopicArn: { Ref: 'CreateProductTopic' },
                    FilterPolicy: '{"count":[{"numeric":["<",2]}]}'
                }
            }
        },
        Outputs: {
            CatalogItemsQueueUrl: {
                Description: 'CatalogItemsQueue URL',
                Value: {
                    Ref: 'CatalogItemsQueue'
                },
                Export: {
                    Name: { 'Fn::Sub': '${AWS::StackName}-CatalogItemsQueueUrl' }
                }
            },
            CatalogItemsQueueArn: {
                Description: 'CatalogItemsQueue Arn',
                Value: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] },
                Export: {
                    Name: { 'Fn::Sub': '${AWS::StackName}-CatalogItemsQueueArn' }
                }
            }
        }
    }
};

module.exports = serverlessConfiguration;
