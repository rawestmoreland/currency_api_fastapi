from datetime import timedelta, datetime
from typing import Optional

from fastapi.responses import RedirectResponse
from app.crud import api_key
from app.database.session import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
import httpx
from app.core.config import settings
from app.crud.user import get_user_by_email, create_user, verify_password
from app.schemas.user import UserIn, UserOut
from app.models import AuthProvider
from jose import jwt

router = APIRouter()


@router.post("/login")
async def local_login(user: UserIn, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(plain_password=user.password, hashed_pasword=db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"jwt": access_token, "token_type": "bearer"}


@router.post('/register')
async def register_user(data: UserIn, db: Session = Depends(get_db)):
    try:
        db_user = get_user_by_email(db, email=data.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        new_user = create_user(
            db=db,
            email=data.email,
            password=data.password,
            first_name=data.first_name,
            last_name=data.last_name
        )
        if (new_user):
            new_key = api_key.create_api_key(db, new_user.id)
            original_api_key = new_key.get('original_api_key')
            new_user.keys = [{"original_api_key": original_api_key}]

        return UserOut(**new_user.__dict__)

    except HTTPException as he:
        raise he

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )


@router.get("/{provider}/login")
async def login(provider: AuthProvider):
    if provider == AuthProvider.GOOGLE:
        redirect_uri = settings.GOOGLE_REDIRECT_URI
        scope = "openid profile email"
        url = f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={redirect_uri}&scope={scope}"
    else:
        raise HTTPException(status_code=400, detail="Invalid provider")

    return RedirectResponse(url)


@router.get("/{provider}/callback")
async def login_callback(access_token: str, provider: str, db: Session = Depends(get_db)):
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not retrieve access token.")

    if provider == AuthProvider.GOOGLE.value:
        async with httpx.AsyncClient() as client:
            response = await client.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {access_token}"})

        google_user_info = response.json()
        email = google_user_info.get("email")

    db_user = get_user_by_email(db, email=email)

    if db_user:
        user_in_db = UserOut(**db_user.__dict__)
    else:
        user_in_db = create_user(
            db, email=email, password="", provider=provider.upper())

        if user_in_db:
            api_key.create_api_key(db, user_id=user_in_db.id)

    access_token_expires = timedelta(
        days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(
        data={"sub": user_in_db.email}, expires_delta=access_token_expires
    )
    return {"jwt": access_token, "token_type": "bearer"}


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt
