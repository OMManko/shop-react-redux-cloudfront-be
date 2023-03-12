import { handlerPath } from '@libs/handler-resolver';

const { BUCKET_NAME } = process.env;

export const importFileParser = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        prefix: 'uploaded/',
        suffix: '.csv',
        existing: true
      },
    },
  ],
};

