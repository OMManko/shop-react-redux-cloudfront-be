import { handlerPath } from '@libs/handler-resolver';

export const importFileParser = {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: "${self:custom.bucketName}",
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: "${self:provider.environment.UPLOAD_FOLDER}/",
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

