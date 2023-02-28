import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductsListMock } from '@functions/getProductsList/getProductsListMock';
import schema from './schema';
import { StatusCodes } from '../../constants/statusCodes';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const productsList = await getProductsListMock();
  
    return formatJSONResponse(productsList);
    
  } catch (e) {
    return formatJSONResponse(
        {
          message: 'Error while fetching product list'
        },
        StatusCodes.InternalServerError
    );
  }
};

export const main = middyfy(getProductsList);


