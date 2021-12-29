# Pydantic models represent data structures sent to frontend

from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    username: str
    logged_in: bool
    favorite_pkmn: Optional[int]

    class Config:
        orm_mode = True
