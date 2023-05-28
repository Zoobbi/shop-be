import {allowHeaders as headers, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {DynamoDB} from "aws-sdk";

const productsTable = process.env.PRODUCTS_TABLE_NAME;
const stockTable = process.env.STOCK_TABLE_NAME;
const db = new DynamoDB.DocumentClient()

export const getProductsById = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const products = await db
        .scan({
          TableName: productsTable
        })
        .promise();

    const stocks = await db
        .scan({
          TableName: stockTable,
        })
        .promise()


    const productFromTable = products.Items.find(product => {
      return product.id === productId;
    });

    const { count } = stocks.Items.find(stock => stock.product_id === productId)

    const product = {...productFromTable, count: count};

    console.log('product with current ID', product)

      return formatJSONResponse(product);
  } catch (error) {
    console.error('Error during database request executing', error);

    return formatJSONResponse({
        response: 'Error during database request executing',
        statusCode: 500,
        headers,
    });
}
};

export const main = middyfy(getProductsById);
