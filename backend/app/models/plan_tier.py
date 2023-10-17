from enum import Enum
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, Enum as SQLAlchemyEnum
from app.database.base import Base


class PlanTierType(Enum):
    FREE = 'free'
    BASIC = 'basic'
    PREMIUM = 'premium'


class PlanTierModel(Base):
    __tablename__ = 'plan_tiers'

    id = Column(Integer, primary_key=True, index=True)
    tier = Column(SQLAlchemyEnum(PlanTierType),
                  unique=True, nullable=False)
    request_limit = Column(Integer)

    users = relationship('User', back_populates='plan_tier')
