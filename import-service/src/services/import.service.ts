import {
	S3Client,
	PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default class ImportService {
	constructor(
		private readonly bucketName: string,
		private readonly s3Client: S3Client,
	) {}
	
	public createSignedUrl(fileName: string): Promise<string> {
		const putObjectParams = {
			Bucket: this.bucketName,
			Key: `uploaded/${fileName}`,
		};
		const command = new PutObjectCommand(putObjectParams);
		
		return getSignedUrl(this.s3Client, command);
	}
}
