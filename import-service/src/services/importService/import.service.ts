import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand
} from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import fileParserService from '../../services/fileParserService';
import { Product } from '../../types/api-types';

const { UPLOAD_FOLDER, PARSED_FOLDER, SQS_URL} = process.env;

export default class ImportService {
	constructor(
		private readonly bucket: string,
		private readonly s3Client: S3Client,
	) {}
	
	async createSignedUrl(file: string): Promise<string> {
		const params = {
			Bucket: this.bucket,
			Key: `${UPLOAD_FOLDER}/${file}`,
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
		const sqs = new AWS.SQS();
		const response = await this.s3Client.send(command);
		const fileStream = response.Body as Readable | null;
		
		if (!fileStream) {
			return Promise.reject(`${file} was not found`);
		}
		
		const parsedFileData = await fileParserService.parseFileStream(fileStream);
		
		try {
			const targetFileName = file.replace(UPLOAD_FOLDER, PARSED_FOLDER);
			
			await this.copyFile(file, targetFileName);
			await this.deleteFile(file);
		} catch (e) {
			console.log(`${file} was not moved`, e);
		}
		
		const parsedProducts = parsedFileData.map((product) => (
			{
				...product,
				count: Number(product.count),
				price: Number(product.price)
			}
		));
		
		console.log('Start sending imported products to the queue');
		
		try {
			await Promise.all(parsedProducts.map((product) => {
				sqs.sendMessage(
					{
						QueueUrl: SQS_URL,
						MessageBody: JSON.stringify(product),
					}, () => {
						console.log('The product was successfully sent to the queue', JSON.stringify(product));
					}
				)
			}));
			
			console.log('Finish sending imported products to the queue');
		} catch (e) {
			console.log('Sending products to the queue failed: ', e);
		}
	}
}
