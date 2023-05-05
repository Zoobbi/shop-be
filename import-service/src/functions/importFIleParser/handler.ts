import csv from 'csv-parser';
import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    S3Client
} from '@aws-sdk/client-s3';
import {formatJSONResponse} from '@libs/api-gateway';
import * as console from "console";
import { Readable } from 'stream';
export const asStream = (response: GetObjectCommandOutput) => { return response.Body as Readable;};

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
            .on('data',  (data) => {
                console.log(' Parsed data: ', data);
            })
            .on('end', moveFile);
    } catch (e) {
        console.log(' importProductsFile ', e);
        return formatJSONResponse(500, {error: e});
    }
};

export const main = importFileParser;


/*
import { S3 } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';



import csv from 'csv-parser';

const s3 = new S3({ region: 'us-east-1' });
const Bucket = 'uploaded-bucket-for-zoobbi-shop';

const importFileParser = async (event: S3Event) => {
  await Promise.all(
    event.Records.map(({ s3: { object } }) => {
      const s3Stream = s3
        .getObject({
          Bucket,
          Key: object.key,
        })
        .createReadStream();

      return new Promise<void>((resolve, reject) => {
        s3Stream
          .pipe(
            csv({
              headers: ['title', 'description', 'price', 'count'],
              skipLines: 1,
            })
          )
          .on('data', async (data) => {
            console.log(data);
          })
          .on('error', (error) => {
            console.log(error);
            reject(error);
          })
          .on('end', async () => {
            await s3
              .copyObject({
                Bucket,
                CopySource: `${Bucket}/${object.key}`,
                Key: object.key.replace('uploaded', 'parsed'),
              })
              .promise();

            await s3
              .deleteObject({
                Bucket,
                Key: object.key,
              })
              .promise();
            resolve();
          });
      });
    })
  );

  return formatJSONResponse({
    message: 'success',
  });
};

export const main = importFileParser;
*/
