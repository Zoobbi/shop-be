import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as console from 'console';
import dotenv from 'dotenv';
import { formatJSONResponse } from '@libs/api-gateway';
import AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';


dotenv.config();

// const s3 = new S3Client({ region: process.env.REGION });
const importProductsFile = async (event: APIGatewayProxyEvent) => {
    const s3 = new AWS.S3({ region: 'us-east-1' });
    const { fileName } = event.queryStringParameters;

    console.log('IN importProductsFile')

    const signedUrl = await s3.getSignedUrlPromise('putObject', {
        Bucket: 'uploaded-bucket-for-zoobbi-shop',
        Expires: 60,
        ContentType: 'text/csv',
        Key: `uploaded/${fileName}`,
    });

    console.log('signedUrl importProductsFile', signedUrl);

    return formatJSONResponse({
        signedUrl,
    });
};

export const main = middyfy(importProductsFile);
