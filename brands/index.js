const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
    const totalSegments = 3; // Number of parallel scan segments
    const scanTasks = [];

    for (let segment = 0; segment < totalSegments; segment++) {
        const params = {
            TableName: 'ScrapedData',
            ProjectionExpression: 'brand', // Only return the 'brand' attribute
            Segment: segment,
            TotalSegments: totalSegments,
        };

        // Push scan operation promise to tasks array
        scanTasks.push(scanDynamoDB(params));
    }

    try {
        // Wait for all scan operations to complete
        const results = await Promise.all(scanTasks);
        // Combine items from all scan results
        const items = [].concat(...results);
        // Extract brands and remove duplicates
        const brands = items.map(item => item.brand);
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