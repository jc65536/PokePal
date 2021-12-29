from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm, APIKeyCookie
from jose import ExpiredSignatureError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from sqlalchemy.orm import Session
from db_access import *
from db_setup import engine, db_connect
import models
import schemas

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

crypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

session_cookie = APIKeyCookie(name="session")


def get_current_user(token: str = Depends(session_cookie), db: Session = Depends(db_connect)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload["sub"]
    except:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    user = find_user(db, username)
    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)
    return user


@app.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(db_connect)):
    user: models.User = find_user(db, form_data.username)
    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    if not crypt.verify(form_data.password, user.password_hash):
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    claims = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)
    response.set_cookie("session", token)
    return {"login": "success"}


@app.get("/profile/", response_model=schemas.User)
def read_users_me(user: schemas.User = Depends(get_current_user)):
    return user
