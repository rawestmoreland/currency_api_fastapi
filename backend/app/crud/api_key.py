import hashlib
import uuid
from sqlalchemy.orm import Session

from app.crud import user
from app.models import APIKey

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from typing import Dict, Optional


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_api_key(plain_key: Optional[str] = None) -> Dict[str, str]:
    verfication_hash = pwd_context.hash(plain_key) if plain_key else None
    search_hash = hashlib.sha256(plain_key.encode()).hexdigest()
    return {"search_hash": search_hash, "verification_hash": verfication_hash}


def create_api_key(db: Session, user_id: int):
    """
    Generate a random API key with the specified length.
    search_hash is used for lookup
    """
    original_api_key = str(uuid.uuid4())
    key_dict = hash_api_key(original_api_key)
    search_hash, verification_hash = key_dict["search_hash"], key_dict["verification_hash"]
    obfuscated_key = obfuscate_api_key(original_api_key)
    db_api_key = APIKey(hashed_api_key=verification_hash,
                        search_key=search_hash, user_id=user_id, obfuscated_key=obfuscated_key)
    db.add(db_api_key)
    db.flush()
    db.refresh(db_api_key)
    db.commit()
    return {"original_api_key": original_api_key, "obfuscated_key": obfuscated_key}


def obfuscate_api_key(api_key: str, visible_chars: int = 5) -> str:
    """
    Obfuscate an API key by keeping `visible_chars` characters at both ends 
    visible and replacing the rest with '*'.
    """
    if len(api_key) <= 2 * visible_chars:
        raise ValueError("API key is too short to obfuscate")

    start = api_key[:visible_chars]
    end = api_key[-visible_chars:]
    middle = '*' * (len(api_key) - 2 * visible_chars)

    return f"{start}{middle}{end}"


def get_api_key(db: Session, plain_key: str):
    search_key = hashlib.sha256(plain_key.encode()).hexdigest()
    return db.query(APIKey).filter(APIKey.search_key == search_key).first()


def get_user_keys_by_id(db: Session, user_id: str):
    db_data = db.query(APIKey).filter(APIKey.user_id == user_id).all()
    return db_data
