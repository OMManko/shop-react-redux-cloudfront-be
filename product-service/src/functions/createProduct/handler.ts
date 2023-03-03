import Ajv from 'ajv';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as uuid from 'uuid';
import { StatusCodes } from '../../constants/statusCodes';
import productService from '../../services';
import { CreateProduct } from '../../types/api-types';
import schema from './schema';

const createProduct = async (event: APIGatewayEvent & CreateProduct): Promise<APIGatewayProxyResult> => {
    const { title, description, price, count } = event.body;
    const ajv = new Ajv()
    const validate = ajv.compile(schema);
    
    try {
        const isValid = validate(event.body);
        
        if (!isValid) {
            console.log('Invalid product data', JSON.stringify(validate.errors));
            throw new Error();
        }
    } catch (e) {
        return formatJSONResponse(
            {
                message: 'Invalid product data'
            },
            StatusCodes.BadRequest
        );
    }
    
    try {
      const product = await productService.createProduct(
          {
              id: uuid.v4(),
              title,
              description,
              price,
              count
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


