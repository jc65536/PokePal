# SQLAlchemy models represent tables in the database

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True, index=True)
    password_hash = Column(String)
    logged_in = Column(Boolean, default=False)
    favorite = Column(Integer, default=0)
