# Pydantic models represent data structures sent to frontend

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
