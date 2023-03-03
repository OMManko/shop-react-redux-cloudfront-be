const AWS = require('aws-sdk');
const REGION = 'eu-central-1';
AWS.config.update({ region: REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const params = {
    RequestItems: {
        "product-service-products-list-table-dev": [
            {
                PutRequest: {
                    Item: {
                        "id": { "S": "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
                        "title": { "S": "Eiffel tower0" },
                        "description": { "S": "Build a detailed model of the Eiffel Tower in Paris, France!" },
                        "count": { "N": "24" },
                        "price": { "N": "110" }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        "id": { "S": "7567ec4b-b10c-48c5-9345-fc73c48a80a1" },
                        "title": { "S": "LEGO® Titanic" },
                        "description": { "S": "Build the ship of dreams with the new LEGO® Titanic" },
                        "count": { "N": "20" },
                        "price": { "N": "100" }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        "id": { "S": "7567ec4b-b10c-48c5-9345-fc73c48a80a3" },
                        "title": { "S": "Diagon Alley™" },
                        "description": { "S": "Enter the world of Diagon Alley™" },
                        "count": { "N": "25" },
                        "price": { "N": "90" }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        "id": { "S": "7567ec4b-b10c-48c5-9345-fc73348a80a1" },
                        "title": { "S": "Lion Knights' Castle" },
                        "description": { "S": "Go medieval with an amazing new set inspired by legendary LEGO® castles" },
                        "count": { "N": "35" },
                        "price": { "N": "86" }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        "id": { "S": "7567ec4b-b10c-48c5-9445-fc73c48a80a2" },
                        "title": { "S": "Jazz Club" },
                        "description": { "S": "Get your ticket to the greatest show around" },
                        "count": { "N": "5" },
                        "price": { "N": "120" }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        "id": { "S": "7567ec4b-b10c-45c5-9345-fc73c48a80a1" },
                        "title": { "S": "Santa's Sleigh" },
                        "description": { "S": "Build a flying sleigh with Aira Windwhistler, the Wind Elf!" },
                        "count": { "N": "25" },
                        "price": { "N": "20" }
                    }
                }
            }
        ]
    }
};

ddb.batchWriteItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});