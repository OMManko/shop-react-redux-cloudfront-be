const AWS = require('aws-sdk');
const fs = require('fs');
const REGION = 'eu-central-1';
AWS.config.update({ region: REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const products = fs.readFileSync(require.resolve("./productsList.json"));
const productsRequests = JSON.parse(products.toString()).map((product) => ({
    PutRequest: {
        Item: {
            ...product,
        },
    },
}));

const params = {
    RequestItems: {
        "product-service-products-list-table-dev": productsRequests
    }
};

ddb.batchWriteItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});