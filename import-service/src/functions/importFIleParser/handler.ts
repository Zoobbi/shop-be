import csv from 'csv-parser';
import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    S3Client
} from '@aws-sdk/client-s3';
import { SQS } from 'aws-sdk';
import {formatJSONResponse} from '@libs/api-gateway';
import * as console from "console";
import { Readable } from 'stream';
export const asStream = (response: GetObjectCommandOutput) => { return response.Body as Readable;};

const SQSInstance = new SQS();

// const { IMPORT_PRODUCT_BUCKET_NAME, REGION, IMPORT_PRODUCT_PARSED_CATALOG_NAME, IMPORT_PRODUCT_CATALOG_NAME } = process.env;

const Bucket = 'uploaded-bucket-for-zoobbi-shop';

const importFileParser = async (event) => {
    try {
        const { object } = event.Records[0].s3;
        const params = {
            Bucket: Bucket,
            Key: object.key,
        };

        const s3 = new S3Client({ region: 'us-east-1' });
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);

        const stream = asStream(response).pipe(csv());

        const moveFile = async () => {
            const copyCommand = new CopyObjectCommand({
                CopySource: `${Bucket}/${object.key}`,
                Bucket: Bucket,
                Key: object.key.replace('uploaded', 'parsed'),
            });

            await s3.send(copyCommand);

            const deleteCommand = new DeleteObjectCommand({
                Bucket: Bucket,
                Key: object.key,
            });

            await s3.send(deleteCommand);
        };

        stream
            .on('data', async (data) => {
                await SQSInstance.sendMessage({
                    QueueUrl: process.env.SQS_URL,
                    MessageBody: JSON.stringify(data),
                }).promise();
            })
            .on('end', moveFile);
    } catch (e) {
        console.log(' importProductsFile ', e);
        return formatJSONResponse(500, {error: e});
    }
};

export const main = importFileParser;
