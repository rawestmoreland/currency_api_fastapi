import httpx

from app.core.config import settings


async def fetch_currency_list():
    api_url = settings.EXCHANGE_RATE_API_URL
    request_url = f"{api_url}/currencies.json"

    async with httpx.AsyncClient() as client:
        response = await client.get(request_url)
        response.raise_for_status()

        return response.json()


async def fetch_exchange_rates(base: str = "USD"):
    api_key = settings.EXCHANGE_RATE_API_KEY
    api_url = settings.EXCHANGE_RATE_API_URL
    request_url = f"{api_url}/latest.json?base={base}&app_id={api_key}"

    async with httpx.AsyncClient() as client:

        response = await client.get(request_url)
        response.raise_for_status()

        data = response.json()

        return data
