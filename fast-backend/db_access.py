# Utility functions for accessing the database

from sqlalchemy.orm import Session

import models


def find_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, username: str, password_hash: str):
    user = models.User()
    user.username = username
    user.password_hash = password_hash
    db.add(user)
    db.commit()
    return user


def login_user(db: Session, user: models.User):
    user.logged_in = True
    db.commit()


def logout_user(db: Session, user: models.User):
    user.logged_in = False
    db.commit()
