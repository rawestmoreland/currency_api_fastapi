from sqlalchemy.orm import mapped_column
from sqlalchemy import Integer, String, DateTime, UniqueConstraint
from app.database.base import Base
from datetime import datetime


class Currency(Base):
    __tablename__ = "currencies"

    id = mapped_column(Integer, primary_key=True, index=True)
    created_at = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow())
    updated_at = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow())
    short_name = mapped_column(String, nullable=False)
    display_name = mapped_column(String, nullable=False)

    __table_args__ = (UniqueConstraint(
        'short_name', 'display_name', name='uix_short_display'),)
