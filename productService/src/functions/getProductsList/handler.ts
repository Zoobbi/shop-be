import {allowHeaders as headers, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from 'aws-sdk';

const productsTable = process.env.PRODUCTS_TABLE_NAME;
const stockTable = process.env.STOCK_TABLE_NAME;
const db = new DynamoDB.DocumentClient()

export const getProductsList = async () => {

  try {
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

    const productsList = products.Items.map((product) => ({
          ...product,
          count: stocks.Items.find((stock) => stock.product_id === product.id).count,
      }));

      console.log('ProductsLists from DB:', productsList);

    return formatJSONResponse({
        products: productsList,
    });
  } catch (error) {
      console.error('Error during database request executing', error);

      return formatJSONResponse({
          response: 'Error during database request executing',
          statusCode: 500,
          headers,
      });
  }
};

export const main = middyfy(getProductsList);
