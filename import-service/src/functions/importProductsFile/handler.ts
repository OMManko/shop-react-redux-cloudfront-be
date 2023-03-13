import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from '../../constants/statusCodes';
import importService from '../../services/importService';

export const importProductsFile = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { name: fileName } = event.queryStringParameters || {};
    
    if (!fileName) {
      return formatJSONResponse(
          {
            message: 'Invalid file name'
          },
          StatusCodes.BadRequest
      );
    }
    
    const signedUrl = await importService.createSignedUrl(fileName);
  
    console.log('The signed URL was successfully created ', JSON.stringify(signedUrl));
    return formatJSONResponse(signedUrl);
    
  } catch (e) {
    console.log('Error while creating signed URL', e);
    return formatJSONResponse(
        {
          message: 'Error while creating signed URL'
        },
        StatusCodes.InternalServerError
    );
  }
};


