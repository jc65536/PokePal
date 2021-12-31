# Pydantic schemas (models) are data structures sent/received to/from frontend
# Not to be confused with SQLAlchemy models

from datetime import datetime

from pydantic import BaseModel


class LoginForm(BaseModel):
    username: str
    password: str


class User(BaseModel):
    username: str
    favorite: int

    class Config:
        orm_mode = True


class SearchResults(BaseModel):
    count: int
    results: list
