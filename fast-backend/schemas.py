# Pydantic models represent data structures sent to frontend

from datetime import datetime

from pydantic import BaseModel


class LoginForm(BaseModel):
    username: str
    password: str


class User(BaseModel):
    username: str
    favorite_pkmn: int

    class Config:
        orm_mode = True


class AutocompleteItem(BaseModel):
    name: str
    id: int


class Autocomplete(BaseModel):
    count: int
    results: list[AutocompleteItem]
