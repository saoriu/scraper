const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
    const params = {
        TableName: 'ScrapedData'
    };

    try {
        const data = await dynamodb.scan(params).promise();
        const brands = data.Items.map(item => item.brand);
        const uniqueBrands = [...new Set(brands)];
        return {
            statusCode: 200,
            body: JSON.stringify(uniqueBrands),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  // Enable CORS
            },
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};