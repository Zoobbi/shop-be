import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'import',
                cors: true,
                request: {
                    parameters: {
                        querystrings: {
                            fileName: true
                        }
                    }
                },
                authorizer: {
                    name: 'basicAuthorizer',
                    arn: { 'Fn::ImportValue': 'authorizerArn' },
                    resultTtlInSeconds: 0,
                    identitySource: 'method.request.header.Authorization',
                    type: 'token',
                },
               response: {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            },
        },
    ],
};
