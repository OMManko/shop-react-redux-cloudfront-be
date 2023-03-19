import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from '../../constants/statusCodes';
import productService from '../../services/productService';

const getProductsList = async (): Promise<APIGatewayProxyResult> => {
    try {
        const productsList = await productService.getProductsList();

        console.log('The product list was successfully received: ', JSON.stringify(productsList));
        return formatJSONResponse(productsList);
    } catch (e) {
        console.log('Error while fetching product list', e);
        return formatJSONResponse(
            {
                message: 'Error while fetching product list'
            },
            StatusCodes.InternalServerError
        );
    }
};

export const main = middyfy(getProductsList);
