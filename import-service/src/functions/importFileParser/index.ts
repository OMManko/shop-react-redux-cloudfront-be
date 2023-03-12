import { handlerPath } from '@libs/handler-resolver';

export const importFileParser = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'import-service-upload-dev',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/'
          },
          {
            suffix: '.csv'
          }
        ],
        existing: true
      },
    },
  ],
};

