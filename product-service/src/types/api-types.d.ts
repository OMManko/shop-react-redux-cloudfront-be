export interface Product {
    title: string;
    id: string;
    price: number;
    description: string;
}

export interface Stock {
    product_id: string;
    count: number;
}

export type ProductInStock = Product & Omit<Stock, 'product_id'>;

export interface CreateProduct {
    body: ProductInStock;
}
