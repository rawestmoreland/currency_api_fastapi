from sqlalchemy import Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship, Session, mapped_column
from datetime import date, datetime

from app.database.base import Base
from app.database.session import get_db
from app.models.api_key_usage import APIKeyUsage


class APIKey(Base):
    __tablename__ = 'api_keys'

    id = mapped_column(Integer, primary_key=True, index=True)
    search_key = mapped_column(String, index=True, unique=True)
    hashed_api_key = mapped_column(String, unique=True)
    is_active = mapped_column(Boolean, default=True, nullable=False)
    name = mapped_column(String, nullable=False, default="My Key")

    obfuscated_key = mapped_column(String, nullable=True, default=None)

    user_id = mapped_column(Integer, ForeignKey(
        'users.id', ondelete='CASCADE'))
    user = relationship("User", back_populates="api_keys")

    created_at = mapped_column(DateTime, default=datetime.utcnow)

    usage_records = relationship("APIKeyUsage", back_populates="api_key")

    def is_limit_exceeded(self, db: Session):
        if self.user.role == "admin":
            return False

        current_month_record = self.get_current_month_record(db)
        if not current_month_record:
            return False  # No record means no usage, hence not exceeded

        limit = self.user.custom_request_limit if self.user.custom_request_limit else self.user.plan_tier.request_limit
        return current_month_record.usage_count >= limit

    def get_current_month_record(self, db: Session):
        today = date.today()
        for record in self.usage_records:
            if record.year == today.year and record.month == today.month:
                return record

        # If not found, create a new record for the current month
        new_record = APIKeyUsage(
            api_key_id=self.id, year=today.year, month=today.month, usage_count=0)

        try:
            db.add(new_record)
            db.flush()
            db.commit()
        except Exception as e:
            db.rollback()
            raise e

        return new_record
