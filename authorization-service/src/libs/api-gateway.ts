import { StatusCodes } from '../constants/statusCodes';

export const formatJSONResponse = (response: any, statusCode?: number) => {
    return {
        statusCode: statusCode || StatusCodes.Success,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(response)
    };
};
