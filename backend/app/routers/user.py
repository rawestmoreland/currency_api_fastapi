from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import UserOut, UserIn
from app.crud.user import create_user
from app.crud.api_key import create_api_key
from app.database.session import get_db
from app.dependencies.protected_route_dependencies import verify_admin_api_key
from app.core.decorators import handle_db_errors
from app.dependencies.auth_dependencies import get_user_from_db

router = APIRouter()


@router.get('/me', response_model=UserOut)
@handle_db_errors
def get_current_user(current_user: UserOut = Depends(get_user_from_db)):
    return current_user


@router.post('/create')
@handle_db_errors
def create_new_user(user: UserIn = None, db: Session = Depends(get_db)):
    db_user = create_user(db,
                          email=user.email,
                          password=user.password,
                          first_name=user.first_name,
                          last_name=user.last_name,
                          provider=user.provider, image=user.image)

    if db_user:
        create_api_key(db, db_user.id)
        return db_user

    return
