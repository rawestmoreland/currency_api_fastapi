from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.crud.api_key import create_api_key as create_key, get_user_keys_by_id
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas import APIKeyOut
from app.dependencies.auth_dependencies import get_user_from_db
from app.core.decorators import handle_db_errors

router = APIRouter()


@router.post("/create")
@handle_db_errors
def create_api_key(current_user: User = Depends(get_user_from_db), db: Session = Depends(get_db)):
    try:
        if not current_user:
            raise HTTPException(status_code=400, detail="User not found")

        data = create_key(db=db, user_id=current_user.id)
        return data.original_api_key
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=400)


@router.get("/user-keys", response_model=List[APIKeyOut])
@handle_db_errors
def get_keys_by_user(current_user: User = Depends(get_user_from_db), db: Session = Depends(get_db)):
    try:
        if not current_user:
            raise HTTPException(status_code=400, detail="User not found")

        api_keys = get_user_keys_by_id(db, current_user.id)
        return [APIKeyOut(**api_key.__dict__) for api_key in api_keys]
    except Exception as e:
        print(e)
        raise HTTPException(detail=str(e), status_code=400)
