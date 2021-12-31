# Routes for my backend API

from datetime import datetime, timedelta
from typing import Iterable, Optional

from fastapi import Depends, HTTPException, status, Response, Body
from jose import jwt

from sqlalchemy.orm import Session

import requests

from app_settings import *
from db_settings import db_connect
from db_access import *
import models
import schemas
from util import *


# A session token is just a JWT of the user's username. The cryptographic
# signature ensures that people can't change their JWT to impersonate other
# users.
def create_session_token(username: str):
    claims = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(minutes=SESSION_LIFETIME_MIN)
    }
    return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)


# Dependency for the protected endpoints. If it returns null, we will throw
# a 403 error code.
def get_current_user(token: str = Depends(session_cookie), db: Session = Depends(db_connect)):
    try:
        payload = jwt.decode(token, SECRET_KEY,
                             algorithms=[ALGORITHM],
                             options={"verify_exp": False})
    except:
        return None

    user = find_user(db, payload["sub"])
    if user is None or not user.logged_in:
        return None

    # Manually check expiration time so that we can log the user out in the
    # database. This way, the backend ultimately controls user sessions, not
    # the tokens.
    exp = datetime.utcfromtimestamp(payload["exp"])
    if exp < datetime.utcnow():
        logout_user(db, user)
        return None

    return user


@app.post("/login")
def login(response: Response, form: schemas.LoginForm, db: Session = Depends(db_connect)):
    user: models.User = find_user(db, form.username)

    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    if not crypt.verify(form.password, user.password_hash):
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    login_user(db, user)

    response.set_cookie("session", create_session_token(user.username))
    return {"login": "success"}


@app.post("/register")
def register(response: Response, form: schemas.LoginForm, db: Session = Depends(db_connect)):
    user: models.User = find_user(db, form.username)

    # Username conflict
    if user is not None:
        raise HTTPException(status.HTTP_409_CONFLICT)

    password_hash = crypt.hash(form.password)
    user = create_user(db, form.username, password_hash)
    login_user(db, user)

    response.set_cookie("session", create_session_token(user.username))
    return {"register": "success"}


@app.post("/logout")
def logout(response: Response, user: models.User = Depends(get_current_user), db: Session = Depends(db_connect)):
    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    logout_user(db, user)
    response.delete_cookie("session")
    return {"logout": "success"}


@app.post("/check-session")
def check_session(user: models.User = Depends(get_current_user)):
    return {"logged-in": user is not None}


@app.get("/user/profile", response_model=schemas.User)
def user_profile(user: models.User = Depends(get_current_user)):
    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    return user


@app.post("/user/set-fav")
def set_fav(user: models.User = Depends(get_current_user), pkmn_id: int = Body(..., embed=True), db: Session = Depends(db_connect)):
    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    user.favorite = pkmn_id
    db.commit()
    return {"set-fav": "success"}


# Search endpoint with support for filters (generations and types)
@app.get("/search", response_model=schemas.SearchResults)
def search(q: Optional[str] = None, gens: Optional[str] = None, types: Optional[str] = None):
    if q is None:
        q = ""

    # Parse the id from a url like https://pokeapi.co/api/v2/pokemon/25/
    def parse_id(url):
        return int(list(filter("".__ne__, url.split("/")))[-1])

    # Returns a set so we can have O(n) intersection
    def to_set(list):
        return {(e["name"], parse_id(e["url"])) for e in list}

    def match_name(list):
        return filter(lambda e: e["name"].startswith(q), list)

    # Get all but the last pokemon
    res = requests.get(pokeapi("pokemon-species/?limit=-1")).json()
    results = res["results"]
    # Get the last pokemon
    res = requests.get(pokeapi("pokemon-species/?offset=" +
                       str(res["count"] - 1))).json()
    results += res["results"]

    results = to_set(match_name(results))

    # Filter results for only pokemon in the specified generations
    if gens is not None:
        gens = gens.lower().split(",")
        total_species = []
        for gen in gens:
            res = requests.get(pokeapi("generation/generation-" + gen)).json()
            total_species += res["pokemon_species"]
        results &= to_set(total_species)

    # Filter results for only pokemon of the specified types
    if types is not None:
        types = types.lower().split(",")
        total_species = []
        for type in types:
            res = requests.get(pokeapi("type/" + type)).json()
            species = filter(lambda pkmn: parse_id(pkmn["url"]) < 10000,
                             map(lambda typepkmn: typepkmn["pokemon"], res["pokemon"]))
            total_species += species
        results &= to_set(total_species)

    # Format the results to a dict for returning
    results = [{"name": name, "id": id} for name, id in results]

    return {
        "count": len(results),
        "results": results
    }
