from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class APIKeyUsage(BaseModel):
    api_key_id: int
    usage_count: int
    year: int
    month: int
    version_id: int
    created_at: Optional[datetime] = datetime.utcnow()
    updated_at: Optional[datetime] = datetime.utcnow()
