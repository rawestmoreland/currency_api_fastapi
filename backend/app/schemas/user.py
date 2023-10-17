from typing import Any, Optional, List
from pydantic import BaseModel

from app.models import AuthProvider


class UserBase(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserIn(UserBase):
    password: Optional[str] = None
    provider: AuthProvider = AuthProvider.LOCAL
    image: Optional[str] = None


class UserInDB(UserBase):
    hashed_password: str
    image: Optional[str] = None
    provider: AuthProvider = AuthProvider.LOCAL


class UserOut(UserBase):
    id: int
    is_active: bool
    email_verified: bool
    image: Optional[str] = None
    provider: AuthProvider
    role: str
    usage: Optional[dict] = None
    keys: Optional[List[dict[str, Any]]] = None

    class Config:
        from_attributes = True
