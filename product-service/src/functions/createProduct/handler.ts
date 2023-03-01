import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as uuid from "uuid";
import { StatusCodes } from '../../constants/statusCodes';
import productService from '../../services';
import { CreateProduct } from '../../types/api-types';

const createProduct = async (event: APIGatewayEvent & CreateProduct): Promise<APIGatewayProxyResult> => {
    const { title, description, price } = event.body;
  try {
      const product = await productService.createProduct(
          {
              id: uuid.v4(),
              title,
              description,
              price
          }
      );
    
      console.log('The product was successfully created', product);
      
      return formatJSONResponse(product);
  } catch (e) {
    console.log('Error while creating a product', e);
    return formatJSONResponse(
        {
          message: 'Error while creating a product'
        },
        StatusCodes.InternalServerError
    );
  }
};

export const main = middyfy(createProduct);


