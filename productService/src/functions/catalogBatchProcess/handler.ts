import { SQSEvent } from 'aws-lambda';
import { getTransactItems } from '@libs/dynamoDBUtils';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDB, SNS } from 'aws-sdk';

export const catalogBatchProcess = async (event: SQSEvent) => {
    const sns = new SNS();
    const dynamo = new DynamoDB.DocumentClient();
    const parsedRecords = event.Records.map((record) => ({
        ...record,
        body: JSON.parse(record.body),
    }));

    console.log('EVENT RECORD', event.Records);
    console.log('EVENT RECORD', event);
    console.log('PARSE RECORD', parsedRecords);

    const response = await dynamo
        .transactWrite({
            TransactItems: parsedRecords.reduce(
                (acc, { body: {title, description, count, price} }) =>
                    acc.concat(getTransactItems({
                        id: uuidv4(),
                        title,
                        description,
                        count: Number(count),
                        price: Number(price),
                    })),
                []
            ),
            ReturnConsumedCapacity: 'TOTAL',
            ReturnItemCollectionMetrics: 'SIZE',
        })
        .promise();

    console.log(response);

    await sns
        .publish({
            Subject: 'Products added successfully',
            MessageAttributes: {
                high_price: {
                    DataType: 'String',
                    StringValue: parsedRecords.some(({ body }) => body.price >= 1000)
                        ? 'true'
                        : 'false',
                },
            },
            Message: JSON.stringify(response.ConsumedCapacity),
            TopicArn: process.env.SNS_ARN,
        })
        .promise();
};

export const main = catalogBatchProcess;
