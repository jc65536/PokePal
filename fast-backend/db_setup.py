# Database setup

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./data.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                       "check_same_thread": False})

def db_connect():
    db = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    try:
        yield db
    finally:
        db.close()
