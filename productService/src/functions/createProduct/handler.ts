import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONResponse, allowHeaders as headers} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {validateProduct} from "@libs/validation";
import {APIGatewayProxyResult} from "aws-lambda";

const { DynamoDB } = require('aws-sdk');
const productsTable = process.env.PRODUCTS_TABLE_NAME;
const stockTable = process.env.STOCK_TABLE_NAME;
const uuid = require('uuid');
const db = new DynamoDB.DocumentClient()

export const createProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (event): Promise<APIGatewayProxyResult> => {

    const isValid = await validateProduct(event.body);

    if (!isValid) {
        console.log('Product data is invalid', event.body);
        return formatJSONResponse({
            response: 'Product data is invalid',
            statusCode: 400,
            headers,
        });
    }

    const { title, description, price, count } = event.body;

    console.log(
        `POST request: {title: ${title}, description: ${description}, price: ${price}, count: ${count}`
    );

    try {
        const id = uuid.v1();

        const itemForProduct = { id: id, title, description, price};
        const itemForStock = { product_id: id, count};

        console.log('db.put', itemForProduct, itemForStock)


        const paramsProduct= {
            TableName: productsTable,
            Item: itemForProduct,
        };

        const paramsStock= {
            TableName: stockTable,
            Item: itemForStock,
        };

        await db.put(paramsProduct).promise();
        await db.put(paramsStock).promise();




        /*  db
              .transactWrite({
                  TransactItems: [
                      {
                          Put: {
                              TableName: productsTable,
                              Item: itemForProduct,
                          },
                      },
                      {
                          Put: {
                              TableName: stockTable,
                              Item: itemForStock,
                          },
                      },
                  ],
              })
              .promise();*/

  /*      await db.put({
            TableName: productsTable,
            Item: itemForProduct,
        }).promise();

        await db.put({
            TableName: stockTable,
            Item: itemForStock,
        }).promise();*/

        return formatJSONResponse({ statusCode: 200, response: { ...itemForProduct, count }, headers });
    } catch (e) {
        console.error('Error during database request executing', e);

        return formatJSONResponse({
            response: 'Error during database request executing',
            statusCode: 500,
            headers,
        });
    }
};

export const main = middyfy(createProduct);
