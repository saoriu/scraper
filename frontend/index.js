const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const brand = event.queryStringParameters ? event.queryStringParameters.brand : null;

    let params = {
        TableName: 'ScrapedData'
    };

    if (brand) {
        params.FilterExpression = 'brand = :brand';
        params.ExpressionAttributeValues = { ':brand': brand };
    }

    try {
        const data = await dynamodb.scan(params).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  // Enable CORS
            },
        };
        return response;
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};