from pydantic import BaseModel, constr
from datetime import datetime
from app.models.user_alert import ThresholdType


class UserAlert(BaseModel):
    id: int
    currency_pair_id: int
    updated_at: datetime
    snooze_time: int = constr(
        ge=0, description="The snooze time must be greater than 0 seconds")
    threshold: float
    threshold_type: ThresholdType = ThresholdType.ABOVE
    alert_active: bool = True
    user_id: int
