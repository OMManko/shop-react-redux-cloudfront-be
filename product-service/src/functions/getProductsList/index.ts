import { handlerPath } from '@libs/handler-resolver';

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'Successfull API Response'
          },
          500: {
            description: 'Error while fetching product list'
          }
        }
      },
    },
  ],
};

