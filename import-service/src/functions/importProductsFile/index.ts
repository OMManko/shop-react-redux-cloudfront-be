import { handlerPath } from '@libs/handler-resolver';

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
        requests: {
          queryParam: true
        },
        responses: {
          200: {
            description: 'Successfull API Response'
          },
          500: {
            description: 'Error while creating signed URL'
          }
        }
      },
    },
  ],
};

