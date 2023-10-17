import os
import time
import redis
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models import APIKeyUsage, APIKey as APIKeyModel, User as UserModel, PlanTierModel
from app.schemas import APIKeyBase as APIKeySchema
from app.core.config import settings
from datetime import datetime

r = redis.StrictRedis(host='localhost', port=6379, db=0)\
    if os.path.exists('.env') else redis.StrictRedis.from_url(settings.REDIS_URL)


def update_api_key_usage(db: Session, key_data: APIKeySchema, retries: int = 3):
    # Generate a unique key for this operation
    lock_key = f"lock:{key_data.id}"

    # Attempt to acquire the lock
    for attempt in range(retries):
        if r.setnx(lock_key, 1):  # Set the key if it does not exist
            try:
                # Set an expiration for the key as a fail-safe
                r.expire(lock_key, 10)

                # Your database operation code here
                today = datetime.today().date()
                record = db.query(APIKeyUsage).filter_by(
                    api_key_id=key_data.id, month=today.month, year=today.year).first()

                if record:
                    record.usage_count += 1
                else:
                    record = APIKeyUsage(
                        api_key_id=key_data.id, month=today.month, year=today.year, usage_count=1)
                    db.add(record)

                db.commit()
                return

            finally:
                # Ensure we release the lock
                r.delete(lock_key)

        else:
            # If we didn't get the lock, sleep for a bit before trying again
            time.sleep(0.1)
    else:
        return "Failed to update after several attempts due to concurrency conflicts."


def get_user_api_key_usage(db: Session, user_id: int) -> dict[str, any]:
    current_month = datetime.now().month
    current_year = datetime.now().year
    usage_details = (
        db.query(
            func.sum(APIKeyUsage.usage_count),
            APIKeyUsage.month,
            APIKeyUsage.year
        )
        .join(APIKeyModel, APIKeyModel.id == APIKeyUsage.api_key_id)
        .filter(
            APIKeyModel.user_id == user_id,
            APIKeyUsage.month == current_month,
            APIKeyUsage.year == current_year
        )
        .group_by(APIKeyUsage.month, APIKeyUsage.year)
        .first()
    )

    if usage_details:
        total_usage, month, year = usage_details
    else:
        total_usage, month, year = {0, current_month, current_year}

    request_limit = (
        db.query(
            case(
                (UserModel.custom_request_limit >=
                 PlanTierModel.request_limit, UserModel.custom_request_limit),
                else_=PlanTierModel.request_limit
            ).label("higher_limit")
        )
        .join(PlanTierModel, PlanTierModel.id == UserModel.plan_tier_id)
        .filter(UserModel.id == user_id)
        .scalar()
    )

    return {"requests_made": total_usage, "request_limit": request_limit, "month": month, "year": year}
