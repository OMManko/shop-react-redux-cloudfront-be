import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsList } from '@functions/getProductsList/productsList';
import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const productId = event.pathParameters?.productId;
  
  const product = productsList.find((product) => product.id === productId);
  
  return formatJSONResponse(product);
};

export const main = middyfy(getProductById);


