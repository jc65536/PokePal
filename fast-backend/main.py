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


def create_session_token(username: str):
    claims = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(minutes=SESSION_LIFETIME_MIN)
    }
    return jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)


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

    exp = datetime.utcfromtimestamp(payload["exp"])
    if exp < datetime.utcnow():
        logout_user(db, user)
        return None

    return user


@app.post("/login")
def login(response: Response, form: schemas.LoginForm = Depends(), db: Session = Depends(db_connect)):
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
    if user is not None:
        raise HTTPException(status.HTTP_409_CONFLICT)

    password_hash = crypt.hash(form.password)
    user = create_user(db, form.username, password_hash)
    login_user(db, user)

    response.set_cookie("session", create_session_token(user.username))
    return {"register": "success"}


@app.post("/logout")
def logout(response: Response, user: models.User = Depends(get_current_user), db: Session = Depends(db_connect)):
    if user is None or not user.logged_in:
        raise HTTPException(status.HTTP_409_CONFLICT)

    logout_user(user)
    response.delete_cookie("session")
    return {"logout": "success"}


@app.get("/user", response_model=schemas.User)
def user_profile(user: models.User = Depends(get_current_user)):
    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    return user


@app.post("/user/set-fav")
def set_pal(user: models.User = Depends(get_current_user), pkmn_id: int = Body(...), db: Session = Depends(db_connect)):
    if user is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    user.favorite_pkmn = pkmn_id
    db.commit()
    return {"set-fav": "success"}


@app.get("/autocomplete")
def autocomplete(q: str, gens: Optional[str] = None, types: Optional[str] = None, response_model=schemas.Autocomplete):
    if q == "":
        return []

    pkmn = []

    def match_names(list): return filter(lambda i: q in i["name"], list)

    if gens is None and types is None:
        # Gets all but the last pokemon
        res = requests.get(pokeapi("pokemon/?limit=-1")).json()
        pkmn += res["results"]
        res = requests.get(pokeapi("pokemon/?offset=" +
                           str(res["count"] - 1))).json()
        pkmn += res["results"]

    if gens is not None:
        gens = gens.lower().split(",")
        for gen in gens:
            res = requests.get(pokeapi("generation/generation-" + gen)).json()
            species_urls = map(lambda species: species["url"],
                               match_names(res["pokemon_species"]))
            for species_url in species_urls:
                res = requests.get(species_url).json()
                pkmn += list(map(lambda var: var["pokemon"], res["varieties"]))

    if types is not None:
        types = types.lower().split(",")
        for type in types:
            res = requests.get(pokeapi("type/" + type)).json()
            pkmn += list(map(lambda typepkmn: typepkmn["pokemon"],
                             res["pokemon_species"]))

    results = list(match_names(pkmn))

    for result in results:
        url = result["url"]
        result["id"] = list(filter("".__ne__, url.split("/")))[-1]
        del result["url"]

    return {
        "count": len(results),
        "results": results
    }
