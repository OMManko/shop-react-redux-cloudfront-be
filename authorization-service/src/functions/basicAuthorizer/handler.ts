import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { Effect } from '../../constants/effect';
import { generateResponse } from '../../utils/generateResponse';
import validationService from '../../services/validationService';

export const basicAuthorizer = async (
    event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
    const { authorizationToken, methodArn } = event;

    if (!authorizationToken) {
        throw new Error('Unauthorized');
    }

    try {
        const isValid = validationService.validateToken(authorizationToken);

        console.log(`Token is valid: ${isValid}`);

        const response = isValid
            ? generateResponse(authorizationToken, Effect.Allow, methodArn)
            : generateResponse(authorizationToken, Effect.Deny, methodArn);

        console.log(`Authorization response: ${JSON.stringify(response)}`);

        return Promise.resolve(response);
    } catch (e) {
        throw new Error('Unauthorized', { cause: e });
    }
};
