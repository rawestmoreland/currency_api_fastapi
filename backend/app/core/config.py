import os
from dotenv import load_dotenv
from fastapi import Request
from fastapi.security import OAuth2AuthorizationCodeBearer
from slowapi import Limiter

if os.path.exists('.env'):
    load_dotenv()


def get_remote_address(request: Request):
    return request.client.host


limiter = Limiter(key_func=get_remote_address)


class Settings:
    SECRET_KEY: str = os.getenv("NEXTAUTH_SECRET")
    ALGORITHM: str = "RS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 90
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    EXCHANGE_RATE_API_KEY: str = os.getenv("EXCHANGE_RATE_API_KEY")
    EXCHANGE_RATE_API_URL: str = os.getenv("EXCHANGE_RATE_API_URL")
    REDIS_URL: str = os.getenv("REDIS_URL")


oauth2_scheme = OAuth2AuthorizationCodeBearer(authorizationUrl="https://accounts.google.com/o/oauth2/auth",
                                              tokenUrl="https://accounts.google.com/o/oauth2/token")


settings = Settings()
