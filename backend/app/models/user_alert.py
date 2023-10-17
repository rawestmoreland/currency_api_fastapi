from enum import Enum
from datetime import datetime
from app.database.base import Base
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import Integer, DateTime, ForeignKey, Enum as SQLAlchemyEnum, Boolean
from app.models import User


class ThresholdType(Enum):
    ABOVE = 'above'
    BELOW = 'below'


class UserAlert(Base):
    __tablename__ = "user_alerts"

    id = mapped_column(Integer, nullable=False, primary_key=True)
    created_at = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow())
    updated_at = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow())
    currency_pair_id = mapped_column(
        Integer, ForeignKey('currency_pairs.id'), nullable=False)
    theshold_type = mapped_column(SQLAlchemyEnum(
        ThresholdType), nullable=False)
    last_alert = mapped_column(DateTime, nullable=False)
    snooze_time = mapped_column(Integer, nullable=False, default=300)
    alert_active = mapped_column(Boolean, nullable=False, default=True)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)

    users = relationship(User, back_populates='alerts')
