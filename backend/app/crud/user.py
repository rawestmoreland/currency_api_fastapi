from sqlalchemy.orm import Session
from app.models import User, AuthProvider, PlanTierModel
from app.schemas import UserOut
from passlib.context import CryptContext
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: Optional[str] = None):
    return pwd_context.hash(password) if password else None


def verify_password(plain_password: str, hashed_pasword: str) -> bool:
    return pwd_context.verify(plain_password, hashed_pasword)


def get_user_by_email(db: Session, email: str) -> User:
    db_user = db.query(User).filter(User.email == email).first()
    return db_user


def create_user(db: Session,
                email: str, password: Optional[str] = None,
                first_name: Optional[str] = None,
                last_name: Optional[str] = None,
                image: Optional[str] = None,
                provider: AuthProvider = AuthProvider.LOCAL):
    try:
        hashed_password = hash_password(password)
        free_plan_tier = db.query(PlanTierModel).filter_by(tier='FREE').first()
        mark_verified = False if provider == AuthProvider.LOCAL else True
        db_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            hashed_password=hashed_password,
            provider=provider,
            plan_tier_id=free_plan_tier.id,
            image=image,
            email_verified=mark_verified
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return UserOut(**db_user.__dict__)

    except Exception as e:
        db.rollback()
        raise ValueError("An unexpected error occurred.") from e
