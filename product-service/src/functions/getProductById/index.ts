import { handlerPath } from '@libs/handler-resolver';

export const getProductById = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'product/{productId}',
                cors: true,
                responses: {
                    200: {
                        description: 'Successfull API Response'
                    },
                    404: {
                        description: 'Product not found'
                    },
                    500: {
                        description: 'Error while fetching product'
                    }
                }
            }
        }
    ]
};
