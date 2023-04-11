import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import {getProductsFromMock} from "@libs/getProductsFromMock";

export const getProductsList = async () => {
  try {
    const products = await getProductsFromMock();

    return formatJSONResponse({
      products,
    });
  } catch (error) {
    return formatJSONResponse({message: error.message},  404);
  }
};

export const main = middyfy(getProductsList);
