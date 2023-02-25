import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import { StatusCodes } from '../constants/statusCodes';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown> | Array<Record<string, unknown>>, statusCode?: number) => {
  return {
    statusCode: statusCode || StatusCodes.Success,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(response)
  }
}
