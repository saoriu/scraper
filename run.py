from pathlib import Path
import asyncio
import stockx
import boto3
from decimal import Decimal


# Create a DynamoDB resource object
dynamodb = boto3.resource('dynamodb')

# Specify the name of your DynamoDB table
table_name = 'ScrapedData'
table = dynamodb.Table(table_name)

async def run(event, context):
    # enable scrapfly cache for basic use
    stockx.BASE_CONFIG["cache"] = True
    # Scrape the sneakers page

    #scrape /search/accessories?s=bags
    url_keys_accessories = await stockx.scrape_search("https://stockx.com/accessories/shoulder-bag", max_pages=5)

    url_keys = url_keys_accessories

    
    for key in url_keys:
        product_url = f"https://stockx.com/{key}"
        product = await stockx.scrape_product(product_url)
        product = convert_floats(product)
        product['id'] = key
        table.put_item(Item=product)

def convert_floats(data):
    if isinstance(data, float):
        return Decimal(str(data))
    elif isinstance(data, dict):
        return {k: convert_floats(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_floats(item) for item in data]
    else:
        return data

def lambda_handler(event, context):
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run(event, context))
    loop.close()
    return {}  # Return an empty dictionary

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run({}, {}))
    loop.close()