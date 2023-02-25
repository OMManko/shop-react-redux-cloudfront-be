import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductsListMock } from '@functions/getProductsList/getProductsListMock';
import schema from './schema';
import { StatusCodes } from '../../constants/statusCodes';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const productsList = await getProductsListMock();
    const productId = event.pathParameters?.productId;
    const product = productsList.find((product) => product.id === productId);
  
    if (product) {
      return formatJSONResponse(product);
    }
    
    return formatJSONResponse(
        {
          message: 'Product not found'
        },
        StatusCodes.NotFound
    );
    
  } catch (e) {
    return formatJSONResponse(
        {
          message: 'Error while fetching product'
        },
        StatusCodes.InternalServerError
    );
  }
};

export const main = middyfy(getProductById);


