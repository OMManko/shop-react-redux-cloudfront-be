import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3Event, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from '../../constants/statusCodes';
import { Product } from '../../types/api-types';
import importService from '../../services/importService';

const importFileParser = async (event: S3Event): Promise<APIGatewayProxyResult> => {
  try {
      await Promise.all(
          event.Records.map(async (record) => {
              const file = record.s3.object.key;
              const parsed: Product[] = await importService.parseFile(file);
            
              console.log('File was successfully parsed: ', JSON.stringify(parsed));
          })
      );
    
  } catch (e) {
    console.log('Error while parsing the file', e);
    return formatJSONResponse(
        {
          message: 'Error while parsing the file'
        },
        StatusCodes.InternalServerError
    );
  }
};

export const main = middyfy(importFileParser);


