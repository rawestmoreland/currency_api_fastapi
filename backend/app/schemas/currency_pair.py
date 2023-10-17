from pydantic import BaseModel
from app.schemas.currency import Currency


class CurrencyPair(BaseModel):
    id: int
    primary_currency: Currency
    secondary_currency: Currency
    ratio: float
