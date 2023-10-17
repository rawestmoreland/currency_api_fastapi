from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, mapped_column
from app.database.base import Base


class APIKeyUsage(Base):
    __tablename__ = 'api_key_usage_records'

    id = mapped_column(Integer, primary_key=True, index=True)
    # Assuming 'api_keys' is your API keys table
    api_key_id = mapped_column(
        Integer, ForeignKey('api_keys.id'), nullable=False)
    api_key = relationship("APIKey", back_populates="usage_records")

    year = mapped_column(Integer, nullable=False)
    month = mapped_column(Integer, nullable=False)
    usage_count = mapped_column(Integer, default=0, nullable=False)
    version_id = mapped_column(Integer, nullable=False)
    __table_args__ = (UniqueConstraint('api_key_id', 'year',
                      'month', name='uq_api_key_year_month'),)
    __mapper_args__ = {"version_id_col": version_id}
