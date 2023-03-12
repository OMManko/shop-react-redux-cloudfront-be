import * as AWS from "@aws-sdk/client-s3";
import ImportService from "./import.service";
import fileParserService from '../fileParserService';

const { BUCKET_NAME, BUCKET_REGION } = process.env;

const importService = new ImportService(BUCKET_NAME, new AWS.S3Client({ region: BUCKET_REGION }), fileParserService);

export default importService;