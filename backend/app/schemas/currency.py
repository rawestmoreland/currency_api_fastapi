from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class Currency(BaseModel):
    id: Optional[int]
    short_name: str
    display_name: str
