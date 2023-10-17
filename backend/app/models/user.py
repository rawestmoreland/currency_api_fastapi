from enum import Enum
from sqlalchemy.orm import relationship, mapped_column
from sqlalchemy import Integer, String, Boolean, Enum as SQLAlchemyEnum, ForeignKey
from app.database.base import Base


class AuthProvider(Enum):
    GOOGLE = "google"
    FACEBOOK = "facebook"
    LOCAL = "local"


class User(Base):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True, index=True)
    first_name = mapped_column(String, nullable=True)
    last_name = mapped_column(String, nullable=True)
    email = mapped_column(String, unique=True, index=True)
    is_active = mapped_column(Boolean, default=True, nullable=False)
    image = mapped_column(String, nullable=True, default=None)
    role = mapped_column(String, default="user", nullable=False)
    email_verified = mapped_column(Boolean, default=False)
    hashed_password = mapped_column(String, nullable=True)
    provider = mapped_column(SQLAlchemyEnum(AuthProvider),
                             default=AuthProvider.LOCAL, nullable=False)
    plan_tier_id = mapped_column(Integer, ForeignKey(
        'plan_tiers.id'), nullable=True)
    custom_request_limit = mapped_column(Integer, nullable=True)

    plan_tier = relationship('PlanTierModel', back_populates='users')
    api_keys = relationship('APIKey', back_populates='user',
                            cascade='all, delete', passive_deletes=True)
    alerts = relationship('UserAlert', back_populates='users',
                          cascade='all, delete', passive_deletes=True)
