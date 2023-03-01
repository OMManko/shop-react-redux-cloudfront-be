import * as AWS from "aws-sdk";
import ProductService from "./product.service";

const { PRODUCTS_LIST_TABLE } = process.env;

const productService = new ProductService(new AWS.DynamoDB.DocumentClient(), PRODUCTS_LIST_TABLE);

export default productService;