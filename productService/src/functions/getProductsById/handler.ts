import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {getProductsFromMock} from "@libs/getProductsFromMock";

export const getProductsById = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const products = await getProductsFromMock();

    const product = products.find(product => {
      return product.id === productId
    });

      return formatJSONResponse(product);
  }
  catch (error){
    return formatJSONResponse({message: "Product not found"},  404);
  }
};

export const main = middyfy(getProductsById);
