# App settings

import os
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.security import APIKeyCookie
from fastapi.middleware.cors import CORSMiddleware

from passlib.context import CryptContext

from db_settings import engine
import models

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
SESSION_LIFETIME_MIN = 60

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

crypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

session_cookie = APIKeyCookie(name="session")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
