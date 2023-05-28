import type { AWS } from '@serverless/typescript';

import { importProductsFile, importFIleParser } from '@functions/index';
/* import importFileParser from "@functions/importFileParser";*/

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    useDotenv: true,
    plugins: ['serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
        region: 'us-east-1',
        stage: 'dev',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            S3_BUCKET: 'uploaded-bucket-for-zoobbi-shop',
            S3_KEY_PRODUCTS: 'uploaded',
            SQS_URL: { 'Fn::ImportValue': 'sqsURL' },
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: "s3:ListBucket",
                Resource: [
                    "arn:aws:s3:::uploaded-bucket-for-zoobbi-shop"
                ]
            },
            {
                Effect: "Allow",
                Action: [
                    "s3:*"
                ],
                Resource: [
                    "arn:aws:s3:::uploaded-bucket-for-zoobbi-shop/*"
                ]
            },
            {
                Effect: 'Allow',
                Action: 'sqs:SendMessage',
                Resource: { 'Fn::ImportValue': 'sqsARN' },
            },
        ]
    },

    functions: { importProductsFile, importFIleParser },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node16',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
