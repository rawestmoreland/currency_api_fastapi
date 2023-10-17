import math
from sqlalchemy.orm import Session
from app.core.decorators import handle_db_errors
from app.models import Currency, CurrencyPair
from datetime import datetime


@handle_db_errors
def fetch_currency_pairs(db: Session, base: str):
    base_currency = db.query(Currency).filter_by(short_name=base).first()

    if not base_currency:
        raise ValueError(f"Unable to find base currency: {base}")

    db_data = db.query(CurrencyPair)\
                .filter_by(primary_currency_id=base_currency.id)\
                .all()

    rates = {pair.secondary_currency.short_name: pair.ratio for pair in db_data}

    response_data = {
        "timestamp": math.floor(datetime.timestamp(db_data[0].updated_at)),
        "base": base,
        "rates": rates
    }

    return response_data


@handle_db_errors
def get_all_currencies(db: Session):
    db_data = db.query(Currency).all()

    return {currency.short_name: currency.display_name for currency in db_data}


@handle_db_errors
def upsert_currencies(db: Session, currencies: dict):
    for short_name, display_name in currencies.items():
        currency = db.query(Currency).filter_by(
            short_name=short_name).first()
        if currency:
            currency.display_name = display_name
            currency.updated_at = datetime.utcnow()
        else:
            db.add(Currency(short_name=short_name, display_name=display_name))

    db.commit()


@handle_db_errors
def upsert_currency_pairs(db: Session, rates: dict, primary_currency: str = "USD"):
    primary_currency_obj = db.query(Currency).filter_by(
        short_name=primary_currency).first()

    if not primary_currency_obj:
        # Handle the case where primary_currency is not found in the Currency table
        raise ValueError(
            f"No currency found for short_name={primary_currency}")

    primary_id = primary_currency_obj.id
    rows_to_update = db.query(CurrencyPair).filter_by(
        primary_currency_id=primary_id).all()
    for secondary_currency, ratio in rates.items():
        secondary_currency_obj = db.query(Currency).filter_by(
            short_name=secondary_currency).first()

        if not secondary_currency_obj:
            continue

        secondary_id = secondary_currency_obj.id

        pair = next(
            (p for p in rows_to_update if p.secondary_currency_id == secondary_id), None)

        if (pair):
            pair.ratio = ratio
            pair.updated_at = datetime.utcnow()
        else:
            db.add(CurrencyPair(primary_currency_id=primary_id,
                   secondary_currency_id=secondary_id, ratio=ratio))

    db.commit()


def fetch_primary_secondary(db: Session, primary: str, secondary: str):
    '''Fetch a specific currency pair'''
    primary_currency = db.query(Currency).filter_by(short_name=primary).first()
    secondary_currency = db.query(Currency).filter_by(
        short_name=secondary).first()

    pair = db.query(CurrencyPair).filter(CurrencyPair.primary_currency_id == primary_currency.id,
                                         CurrencyPair.secondary_currency_id == secondary_currency.id).first()

    return {pair.primary_currency.short_name: pair.primary_currency.display_name, pair.secondary_currency.short_name: pair.secondary_currency.display_name, "ratio": pair.ratio}
