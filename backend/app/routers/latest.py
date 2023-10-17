from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, Depends, Query, Request
from fastapi.responses import JSONResponse

from sqlalchemy.orm import Session
from app.core.decorators import handle_route_errors
from app.crud.api_key_usage import update_api_key_usage
from app.database.session import get_db
from app.crud.currency import fetch_currency_pairs, fetch_primary_secondary, upsert_currency_pairs
from app.dependencies.protected_route_dependencies import verify_admin_api_key, verify_api_key
from app.services.exchange_rate_api import fetch_exchange_rates
from app.schemas import APIKeyInternal
from app.services.functions.compute_all import compute_rates_for_all_bases
from app.core.config import limiter

router = APIRouter()


@router.get("/")
@limiter.limit("100/minute")
@handle_route_errors
async def get_currency_pairs(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db), verify_key: APIKeyInternal = Depends(verify_api_key), base: Optional[str] = Query("USD")):
    data = fetch_currency_pairs(db, base=base)
    background_tasks.add_task(update_api_key_usage,
                              db, verify_key)

    return data


@router.get('/update')
@handle_route_errors
async def update_currency_pairs(db: Session = Depends(get_db), api_key: None = Depends(verify_admin_api_key)):
    data = await fetch_exchange_rates()

    all_rates = compute_rates_for_all_bases(data)

    for primary, rates in all_rates.items():
        upsert_currency_pairs(db, rates, primary_currency=primary)

    return JSONResponse(content={"status": "success", "code": 200}, status_code=200)


@router.get('/pair')
@limiter.limit("5/minute")
@handle_route_errors
def convert_pair(request: Request, db: Session = Depends(get_db), primary: str = "USD", secondary: str = "EUR"):
    data = fetch_primary_secondary(db, primary.upper(), secondary.upper())
    return data
