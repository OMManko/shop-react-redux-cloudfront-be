import { handlerPath } from '@libs/handler-resolver';

export const createProduct = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'Successfull API Response',
          },
          400: {
            description: 'Product data is invalid'
          },
          500: {
            description: 'Error while fetching product'
          }
        }
      },
    },
  ],
};



