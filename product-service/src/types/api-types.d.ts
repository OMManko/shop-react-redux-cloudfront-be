export interface Product {
	title: string;
	id: string;
	price: number;
	description: string;
}

export interface CreateProduct {
	body: Product
}