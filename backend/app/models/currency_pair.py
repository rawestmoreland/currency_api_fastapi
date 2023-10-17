from enum import Enum
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import Integer, DateTime, ForeignKey, UniqueConstraint, Float
from app.database.base import Base
from datetime import datetime


class CurrencyPair(Base):
    __tablename__ = "currency_pairs"

    id = mapped_column(Integer, primary_key=True, index=True)
    created_at = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow())
    updated_at = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow())
    primary_currency_id = mapped_column(
        Integer, ForeignKey('currencies.id', ondelete='CASCADE'), nullable=False)
    primary_currency = relationship(
        'Currency', foreign_keys=[primary_currency_id])

    secondary_currency_id = mapped_column(
        Integer, ForeignKey('currencies.id', ondelete='CASCADE'), nullable=False)
    secondary_currency = relationship(
        'Currency', foreign_keys=[secondary_currency_id])

    ratio = mapped_column(Float, nullable=False)

    __table_args__ = (UniqueConstraint('primary_currency_id',
                      'secondary_currency_id', name='_currency_pair_uc'),)
