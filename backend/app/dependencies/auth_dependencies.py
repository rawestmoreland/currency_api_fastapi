from fastapi import Depends, HTTPException, status
from jose import jwt
from sqlalchemy.orm import Session
from app.core.config import settings, oauth2_scheme
from app.crud.user import get_user_by_email
from app.crud.api_key_usage import get_user_api_key_usage
from app.crud.api_key import get_user_keys_by_id
from app.database.session import get_db
from app.schemas import UserOut


def get_current_user_from_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception as e:
        raise credentials_exception
    return email


def get_user_from_db(email: str = Depends(get_current_user_from_token), db: Session = Depends(get_db)) -> UserOut:
    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    usage = get_user_api_key_usage(db, user.id)
    keys = get_user_keys_by_id(db, user.id)
    return UserOut(**user.__dict__,
                   usage=usage,
                   keys=[{
                       "obfuscated_key": key.obfuscated_key,
                       "name": key.name,
                       "created_at": key.created_at,
                       "is_active": key.is_active,
                       "id": key.id
                   } for key in keys])
