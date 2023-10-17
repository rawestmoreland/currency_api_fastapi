from typing import Optional
from fastapi import Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.crud.api_key import get_api_key
from app.database.session import get_db
from app.schemas.api_key import APIKeyInDB


async def verify_api_key(access_token: Optional[str] = Query(None), db: Session = Depends(get_db)):

    if not access_token:
        raise HTTPException(status_code=400, detail='API Key is required')

    api_key_data = get_api_key(db, access_token)

    if not api_key_data:
        raise HTTPException(status_code=401, detail='Invalid API Key')

    if api_key_data.is_limit_exceeded(db):
        raise HTTPException(
            status_code=429, detail='API Key usage limit exceeded')

    return APIKeyInDB(id=api_key_data.id, user=api_key_data.user, api_key=access_token)


def verify_admin_api_key(access_token: Optional[str] = Query(None), db: Session = Depends(get_db)):
    print(f"TOKEN: {access_token}")
    if not access_token:
        raise HTTPException(status_code=400, detail='API Key is required')

    api_key_data = get_api_key(db, access_token)

    if not api_key_data or api_key_data.user.role != "admin":
        raise HTTPException(status_code=401, detail='Invalid API Key')

    return
