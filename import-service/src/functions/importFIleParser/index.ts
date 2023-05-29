import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'uploaded-bucket-for-zoobbi-shop',
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [
          {
            prefix: 'uploaded/',
          },
          {
            suffix: '.csv',
          },
        ],
      },
    },
  ],
};
