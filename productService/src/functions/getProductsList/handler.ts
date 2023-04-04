import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import {getProductsFromMock} from "@libs/getProductsFromMock";

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const products = await getProductsFromMock();

    return formatJSONResponse({
      products,
    });
  } catch (error) {
    return formatJSONResponse({message: error},  404);
  }


};

export const main = middyfy(getProductsList);
