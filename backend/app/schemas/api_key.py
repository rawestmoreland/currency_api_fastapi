from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.schemas.user import UserOut


class APIKeyBase(BaseModel):
    user_id: int


class APIKeyIn(APIKeyBase):
    api_key: str


class APIKeyInternal(BaseModel):
    id: int
    api_key: str
    user: UserOut


class APIKeyInDB(APIKeyBase):
    id: Optional[int]
    hashed_api_key: str
    search_key: str
    obfuscated_key: Optional[str] = None


class APIKeyOut(BaseModel):
    id: int
    obfuscated_key: Optional[str] = None
    created_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    name: Optional[str] = None

    class Config:
        from_attributes: True
