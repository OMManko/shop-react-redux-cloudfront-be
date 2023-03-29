import { APIGatewayAuthorizerResult, PolicyDocument } from 'aws-lambda';
import { Effect } from '../constants/effect';

const generatePolicyDocument = (effect: Effect, resource: string): PolicyDocument => {
    return {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    };
};

export const generateResponse = (
    principalId: string,
    effect: Effect,
    resource: string
): APIGatewayAuthorizerResult => {
    return {
        principalId,
        policyDocument: generatePolicyDocument(effect, resource)
    };
};
