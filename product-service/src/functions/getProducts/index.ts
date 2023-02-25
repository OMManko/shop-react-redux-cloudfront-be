import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/getProductsList.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};



