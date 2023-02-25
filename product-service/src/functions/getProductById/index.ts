import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const getProductById = {
  handler: `${handlerPath(__dirname)}/getProductById.handler`,
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



