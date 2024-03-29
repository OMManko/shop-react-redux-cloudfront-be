import { handlerPath } from '@libs/handler-resolver';

export const importProductsFile = {
    handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
    events: [
        {
            http: {
                method: 'get',
                path: '/import',
                cors: true,
                request: {
                    parameters: {
                        querystrings: {
                            name: true
                        }
                    }
                },
                authorizer: {
                    arn: '${self:provider.environment.BASIC_AUTHORIZER_ARN}',
                    type: 'token'
                }
            }
        }
    ]
};
