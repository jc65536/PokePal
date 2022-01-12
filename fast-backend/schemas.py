# Pydantic schemas (models) are data structures sent/received to/from frontend
# Not to be confused with SQLAlchemy models

from typing import List

from pydantic import BaseModel


class LoginForm(BaseModel):
    username: str
    password: str


class User(BaseModel):
    username: str
    favorite: int

    class Config:
        orm_mode = True


class Result(BaseModel):
    name: str
    id: int


class SearchResults(BaseModel):
    count: int
    results: List[Result]
