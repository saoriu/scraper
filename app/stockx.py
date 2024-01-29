import json
import math
import os
from nested_lookup import nested_lookup
from typing import Dict, List

from loguru import logger as log
from scrapfly import ScrapeApiResponse, ScrapeConfig, ScrapflyClient

SCRAPFLY = ScrapflyClient(key=os.environ["SCRAPFLY_KEY"])
BASE_CONFIG = {
    "asp": True,
}

def parse_nextjs(result: ScrapeApiResponse) -> Dict:
    """parse a next.js page for its data"""
    if result.selector.type == "html":
        data = result.selector.css("script#__NEXT_DATA__::text").get()
        return json.loads(data)
    elif result.selector.type == "json":
        return json.loads(result.content)
    else:
        raise ValueError(f"Unsupported selector type: {result.selector.type}")
    
async def scrape_product(url: str) -> Dict:
    """scrape a single stockx product page for product data"""
    log.info("scraping product {}", url)
    result = await SCRAPFLY.async_scrape(ScrapeConfig(url, **BASE_CONFIG))
    data = parse_nextjs(result)
    # extract all products datasets from page cache
    products = nested_lookup("product", data)
    # find the current product dataset
    try:
        product = next(p for p in products if p.get("urlKey") in result.context["url"])
    except StopIteration:
        raise ValueError("Could not find product dataset in page cache", result.context)

    # Make an additional request to the StockX API to get the market data
    market_url = f"https://stockx.com/api/browse?_search={product.get('urlKey')}&page=1&resultsPerPage=1"
    market_result = await SCRAPFLY.async_scrape(ScrapeConfig(market_url, **BASE_CONFIG))
    market_data = parse_nextjs(market_result)
    market = nested_lookup("market", market_data)[0]

    extracted_product = {
        **product,
        "urlKey": product.get("urlKey"),
        "market": {
            "skuUuid": market.get("skuUuid"),
            "productUuid": market.get("productUuid"),
            "lowestAsk": market.get("lowestAsk"),
            "expressShipping": market.get("expressShipping"),
            "lowestAskSize": market.get("lowestAskSize"),
            "numberOfAsks": market.get("numberOfAsks"),
            "hasAsks": market.get("hasAsks"),
            "salesThisPeriod": market.get("salesThisPeriod"),
            "salesLastPeriod": market.get("salesLastPeriod"),
            "highestBid": market.get("highestBid"),
            "highestBidSize": market.get("highestBidSize"),
            "numberOfBids": market.get("numberOfBids"),
            "hasBids": market.get("hasBids"),
            "annualHigh": market.get("annualHigh"),
            "annualLow": market.get("annualLow"),
            "deadstockRangeLow": market.get("deadstockRangeLow"),
            "deadstockRangeHigh": market.get("deadstockRangeHigh"),
            "volatility": market.get("volatility"),
            "deadstockSold": market.get("deadstockSold"),
            "pricePremium": market.get("pricePremium"),
            "averageDeadstockPrice": market.get("averageDeadstockPrice"),
            "lastSale": market.get("lastSale"),
            "lastSaleSize": market.get("lastSaleSize"),
            "salesLast72Hours": market.get("salesLast72Hours"),
            "changeValue": market.get("changeValue"),
            "changePercentage": market.get("changePercentage"),
            "absChangePercentage": market.get("absChangePercentage"),
            "totalDollars": market.get("totalDollars"),
            "lastLowestAskTime": market.get("lastLowestAskTime"),
            "lastHighestBidTime": market.get("lastHighestBidTime"),
            "lastSaleDate": market.get("lastSaleDate"),
            "deadstockSoldRank": market.get("deadstockSoldRank"),
            "pricePremiumRank": market.get("pricePremiumRank"),
            "averageDeadstockPriceRank": market.get("averageDeadstockPriceRank"),
            "featured": market.get("featured")
        },
        "primaryTitle": product.get("primaryTitle"),
        "secondaryTitle": product.get("secondaryTitle"),
        "model": product.get("model"),
        "styleId": product.get("styleId"),
        "brand": product.get("brand"),
    }
    return extracted_product

async def scrape_search(url: str, max_pages: int = 5) -> List[str]:
    """Scrape StockX search"""
    log.info("scraping search {}", url)
    first_page = await SCRAPFLY.async_scrape(ScrapeConfig(url, **BASE_CONFIG))
    # parse first page for product search data and total amount of pages:
    data = parse_nextjs(first_page)
    _first_page_results = nested_lookup("results", data)[0]
    _paging_info = _first_page_results["pageInfo"]
    total_pages = _paging_info["pageCount"] or math.ceil(_paging_info["total"] / _paging_info["limit"])
    if max_pages < total_pages:
        total_pages = max_pages

    product_previews = [edge["node"] for edge in _first_page_results["edges"]]

    # then scrape other pages concurrently:
    log.info("scraping search {} pagination ({} more pages)", url, total_pages - 1)
    _other_pages = [
    ScrapeConfig(f"{first_page.context['url']}?page={page}", **BASE_CONFIG) 
    for page in range(2, total_pages + 1)
    ]

    async for result in SCRAPFLY.concurrent_scrape(_other_pages):
        if result.error:
            log.error("Failed to scrape page: {}", result.error)
        else:
            data = parse_nextjs(result)
            _page_results = nested_lookup("results", data)[0]
            product_previews.extend([edge["node"] for edge in _page_results["edges"]])
            log.info("Successfully scraped page: {}", result)  # print the whole result object
    
    url_keys = list(set([product["urlKey"] for product in product_previews]))  # use a set to remove duplicates
    log.info("extracted {} urlKeys from {}", len(url_keys), url)
    return url_keys
