import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from '../../constants/statusCodes';
import productService from '../../services/productService';

const getProductById = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const productId = event.pathParameters?.productId;
        const product = await productService.getProductById(productId);

        if (product) {
            console.log('The product was successfully received: ', JSON.stringify(product));
            return formatJSONResponse(product);
        }

        console.log('The product was not found');
        return formatJSONResponse(
            {
                message: 'The product was not found'
            },
            StatusCodes.NotFound
        );
    } catch (e) {
        console.log('Error while fetching product', e);
        return formatJSONResponse(
            {
                message: 'Error while fetching product'
            },
            StatusCodes.InternalServerError
        );
    }
};

export const main = middyfy(getProductById);
