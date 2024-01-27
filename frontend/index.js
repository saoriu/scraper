const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const brand = event.queryStringParameters ? event.queryStringParameters.brand : null;

    const totalSegments = 3; // Number of parallel scan segments
    const scanTasks = [];

    for (let segment = 0; segment < totalSegments; segment++) {
        const params = {
            TableName: 'ScrapedData',
            ProjectionExpression: 'secondaryTitle, model, media, market', // Only return these attributes
            Segment: segment,
            TotalSegments: totalSegments,
        };

        if (brand) {
            params.FilterExpression = 'brand = :brand';
            params.ExpressionAttributeValues = { ':brand': brand };
        }

        // Push scan operation promise to tasks array
        scanTasks.push(scanDynamoDB(params));
    }

    try {
        // Wait for all scan operations to complete
        const results = await Promise.all(scanTasks);
        // Combine items from all scan results
        const items = [].concat(...results);

        const response = {
            statusCode: 200,
            body: JSON.stringify(items),
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

async function scanDynamoDB(params) {
    let items = [];
    let data;
    do {
        data = await dynamodb.scan(params).promise();
        items = [...items, ...data.Items];
        params.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);
    return items;
}