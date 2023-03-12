import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { Product } from '../../types/api-types';

export default class ImportService {
	constructor(
		private readonly bucket: string,
		private readonly s3Client: S3Client,
		private readonly fileParser: any
	) {}
	
	async createSignedUrl(file: string): Promise<string> {
		const params = {
			Bucket: this.bucket,
			Key: `uploaded/${file}`,
		};
		const command = new PutObjectCommand(params);
		
		return getSignedUrl(this.s3Client, command);
	}
	
	private async copyFile(file: string, targetFile: string): Promise<void> {
		const params = {
			Bucket: this.bucket,
			Key: targetFile,
			CopySource: `${this.bucket}/${file}`,
		};
		
		const command = new CopyObjectCommand(params);
		
		await this.s3Client.send(command);
		
		console.log(`${file} was successfully moved`);
	}
	
	private async deleteFile(file: string): Promise<void> {
		const params = {
			Bucket: this.bucket,
			Key: file,
		};
		
		const command = new DeleteObjectCommand(params);
		
		await this.s3Client.send(command);
		
		console.log(`${file} was successfully deleted`);
	}
	
	async parseFile(file: string): Promise<Product[]> {
		const getObjectParams = {
			Bucket: this.bucket,
			Key: file,
		};
		
		const command = new GetObjectCommand(getObjectParams);
		const response = await this.s3Client.send(command);
		const fileStream = response.Body as Readable | null;
		
		if (!fileStream) {
			return Promise.reject(`${file} was not found`);
		}
		
		const parsedFile = await this.fileParser.parseFileStream(fileStream);
		
		try {
			const targetFileName = file.replace('uploaded', 'parsed');
			
			await this.copyFile(file, targetFileName);
			await this.deleteFile(file);
		} catch (e) {
			console.log(`${file} was not moved`, e);
		}
		
		return parsedFile;
	}
}
