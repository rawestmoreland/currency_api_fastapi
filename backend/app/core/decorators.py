from typing import Callable, Any
from functools import wraps
from sqlalchemy.exc import IntegrityError, DataError, SQLAlchemyError
from sqlalchemy.orm import Session
from fastapi import HTTPException
import asyncio


def handle_db_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        db: Session = kwargs.get('db')
        if not db:
            for arg in args:
                if isinstance(arg, Session):
                    db = arg
                    break

        try:
            return func(*args, **kwargs)

        except IntegrityError as ie:
            if db:
                db.rollback()
            print("Integrity Error: ", str(ie))
            raise ValueError("A database integrity error occurred: " + str(ie))

        except DataError as de:
            if db:
                db.rollback()
            print("Data Error: ", str(de))
            raise ValueError("A database data error occurred: " + str(de))

        except SQLAlchemyError as e:
            if db:
                db.rollback()
            print("SQLAlchemy Error: ", str(e))
            raise ValueError("A database error occurred: " + str(e))

        except Exception as e:
            if db:
                db.rollback()
            print("Unexpected Error: ", str(e))
            raise

    return wrapper


def handle_route_errors(func: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(func)
    async def async_wrapper(*args, **kwargs):
        db: Session = kwargs.get('db')
        if not db:
            for arg in args:
                if isinstance(arg, Session):
                    db = arg
                    break

        try:
            if asyncio.iscoroutinefunction(func):
                return await func(*args, **kwargs)
            else:
                return func(*args, **kwargs)

        except IntegrityError:
            if db:
                db.rollback()
            raise HTTPException(
                status_code=400, detail="Database integrity error.")

        except DataError:
            if db:
                db.rollback()
            raise HTTPException(status_code=400, detail="Database data error.")

        except SQLAlchemyError:
            if db:
                db.rollback()
            raise HTTPException(status_code=500, detail="Database error.")

        except Exception as e:
            if db:
                db.rollback()
            raise HTTPException(
                status_code=500, detail=f"Unexpected error: {str(e)}")

    return async_wrapper
