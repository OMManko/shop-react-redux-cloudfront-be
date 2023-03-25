import { formatJSONResponse } from '@libs/api-gateway';

export const basicAuthorizer = async () => {
    return formatJSONResponse({
        message: 'Hello basicAuthorizer!'
    });
};
