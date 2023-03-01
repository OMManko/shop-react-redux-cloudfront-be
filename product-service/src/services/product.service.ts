import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Product } from '../types/api-types';

export default class ProductService {
	constructor(
		private readonly docClient: DocumentClient,
		private readonly tableName: string
	) {}
	
	async getProductsList(): Promise<Product[]> {
		const result = await this.docClient
			.scan({
				TableName: this.tableName,
			})
			.promise();
		
		return result.Items as Product[];
	}
	
	async getProductById(id: string): Promise<Product> {
		const result = await this.docClient
			.get({
				TableName: this.tableName,
				Key: { id },
			})
			.promise();
		
		return result.Item as Product;
	}
	
	async createProduct(product: Product): Promise<Product> {
		await this.docClient
			.put({
				TableName: this.tableName,
				Item: product
			})
			.promise();
		
		return product;
	}
}
