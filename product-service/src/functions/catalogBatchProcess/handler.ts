import { SQSEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import Ajv from 'ajv';
import productService from '../../services';
import { formatJSONResponse } from '@libs/api-gateway';
import { StatusCodes } from '../../constants/statusCodes';
import schema from '@functions/createProduct/schema';
import { ProductInStock } from '../../types/api-types';

export const catalogBatchProcess = async (event: SQSEvent) => {
    const products: ProductInStock[] = event.Records.map((record) => JSON.parse(record.body));
    const validProducts: ProductInStock[] = []
    const ajv = new Ajv()
    const validate = ajv.compile(schema);
    const sns = new AWS.SNS({ region: process.env.AWS_REGION });
    
    try {
        await Promise.all(
            products.map(async (product: ProductInStock) => {
                const isValid = validate(product);
                if (isValid) {
                    validProducts.push(product);
                }
            }),
        );
    } catch (e) {
        console.log('Invalid product data', e);
    }
    
  await Promise.all(
      validProducts.map(async (product) => {
        try {
          await productService.createProduct(product);
          
          console.log('The product was successfully added: ', JSON.stringify(product));
          
          sns.publish({
            Subject: 'Product addition',
            Message: JSON.stringify(product),
            TopicArn: process.env.SNS_ARN
          }, () => {
              console.log(`Notification about the product ${JSON.stringify(product)} was successfully sent`)
          })
          
        } catch (e) {
          console.log('Error while adding a product', e);
          
          return formatJSONResponse(
              {
                message: 'Error while adding a product'
              },
              StatusCodes.InternalServerError
          );
        }
      })
  );
};


