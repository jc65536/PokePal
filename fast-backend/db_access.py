# Utility functions for accessing the database

from sqlalchemy.orm import Session

import models


def find_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, username: str, password: str):
    password_hash = password + "notreallyhashed"
    db_user = models.User(username=username, password_hash=password_hash)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
