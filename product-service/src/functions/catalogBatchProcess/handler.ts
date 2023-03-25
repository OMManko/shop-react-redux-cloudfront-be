import { SQSEvent } from 'aws-lambda';
import Ajv from 'ajv';
import { formatJSONResponse } from '@libs/api-gateway';
import { StatusCodes } from '../../constants/statusCodes';
import schema from '@functions/createProduct/schema';
import { ProductInStock } from '../../types/api-types';
import productService from '../../services/productService';
import notificationService from '../../services/notificationService';

export const catalogBatchProcess = async (event: SQSEvent) => {
    const products: ProductInStock[] = event.Records.map(record => JSON.parse(record.body));
    const validProducts: ProductInStock[] = [];
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    
    console.log('Start validating products: ', JSON.stringify(products));
    
    try {
        await Promise.all(
            products.map(async (product: ProductInStock) => {
                const isValid = validate(product);
                if (isValid) {
                    validProducts.push(product);
                }
            })
        );
    } catch (e) {
        console.log('Invalid product data', e);
    }
    
    console.log('Finished validating and start adding products: ', JSON.stringify(validProducts));
    
    await Promise.all(
        validProducts.map(async product => {
            try {
                await productService.createProduct(product);

                console.log('The product was successfully added: ', JSON.stringify(product));

                await notificationService.sendNotification(product);
            } catch (e) {
                console.log('Error while adding a product', e);

                return formatJSONResponse(
                    { message: 'Error while adding a product' },
                    StatusCodes.InternalServerError
                );
            }
        })
    );
};
