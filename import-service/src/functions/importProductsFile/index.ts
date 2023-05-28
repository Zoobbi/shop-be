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
               response: {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            },
        },
    ],
};
