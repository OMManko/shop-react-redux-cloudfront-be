import * as uuid from 'uuid';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Product, ProductInStock, Stock } from '../types/api-types';

export default class ProductService {
	constructor(
		private readonly docClient: DocumentClient,
		private readonly productsListTableName: string,
		private readonly stockTableName: string
	) {}
	
	async getProductsList(): Promise<ProductInStock[]> {
		const result = await Promise.all([
			this.docClient.scan( { TableName: this.productsListTableName }).promise(),
			this.docClient.scan({ TableName: this.stockTableName}).promise()
		]);
		
		const products = result[0].Items as Product[];
		const stocks = result[1].Items as Stock[];

		return products.map(
			(product: Product) => {
				const stock = stocks.find(
					(item: Stock) => item.product_id === product.id
				);
				
				return {
					...product,
					count: stock?.count || 0,
				};
			}
		);
	}
	
	async getProductById(id: string): Promise<ProductInStock> {
		const result  = await Promise.all([
			this.docClient.get({ TableName: this.productsListTableName, Key: { id } }).promise(),
			this.docClient.get({ TableName: this.stockTableName, Key: { product_id: id }}).promise()
		]);
		
		const product = result[0].Item as Product;
		const stock = result[1].Item as Stock;
		
		return {
			id,
			title: product.title,
			description: product.description,
			price: product.price,
			count: stock.count,
		};
	}
	
	async createProduct(product: Omit<ProductInStock, 'id'>): Promise<ProductInStock> {
		const id = uuid.v4();
		
		await Promise.all([
			this.docClient.put( { TableName: this.productsListTableName, Item: { id, title: product.title, description: product.description, price: product.price }}).promise(),
			this.docClient.put({ TableName: this.stockTableName, Item: { product_id: id, count: product.count }}).promise()
		]);
		
		return { id, ...product };
	}
}
