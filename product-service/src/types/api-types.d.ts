export interface Product {
	title: string;
	id: string;
	price: number;
	description: string;
	count: number;
}

export interface CreateProduct {
	body: Product
}