# Database settings

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                       "check_same_thread": False})

make_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def db_connect():
    db = make_session()
    try:
        yield db
    finally:
        db.close()
