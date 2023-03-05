const AWS = require('aws-sdk');
const fs = require('fs');
const REGION = 'eu-central-1';
AWS.config.update({ region: REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const products = fs.readFileSync(require.resolve("./productsList.json"));
const stocks = fs.readFileSync(require.resolve("./stockList.json"));

const productsRequests = JSON.parse(products.toString()).map((product) => ({
    PutRequest: {
        Item: {
            ...product,
        },
    },
}));

const stocksRequests = JSON.parse(stocks.toString()).map((stock) => ({
    PutRequest: {
        Item: {
            ...stock,
        },
    },
}));

const params = {
    RequestItems: {
        "product-service-products-list-table-dev": productsRequests,
        "product-service-stock-table-dev": stocksRequests
    }
};

ddb.batchWriteItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});