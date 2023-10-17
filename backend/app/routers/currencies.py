from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.services.exchange_rate_api import fetch_currency_list
from app.database.session import get_db
from app.crud.currency import upsert_currencies, get_all_currencies
from app.core.config import limiter

router = APIRouter()


@router.get('/')
@limiter.limit("100/minute")
async def get_currencies(request: Request, db: Session = Depends(get_db)):
    data = get_all_currencies(db)

    return data


@router.get('/update')
async def update_currencies(db: Session = Depends(get_db)):
    currencies = await fetch_currency_list()

    upsert_currencies(db, currencies)

    return JSONResponse(content={"status": "success", "code": 200}, status_code=200)
