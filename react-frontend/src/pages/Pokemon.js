import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backend, pokeapi, titleCase, setTitle } from "../util";
import PokemonDisplay from "../components/PokemonDisplay";
import { AuthContext } from "../AuthContext";

import "../css/Pokemon.css";

function Pokemon() {
  const { name } = useParams();
  const [speciesInfo, setSpeciesInfo] = useState({});
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(async () => {
    setTitle(titleCase(name));
    const res = await fetch(pokeapi("pokemon-species/" + name));
    const json = await res.json();
    const flavorTexts = json["flavor_text_entries"].filter(e => e["language"]["name"] == "en");
    setSpeciesInfo({
      pkmnId: json["id"],
      flavorText: flavorTexts[flavorTexts.length - 1]["flavor_text"],
      color: json["color"]["name"],
      varietyUrls: json["varieties"].map(e_1 => e_1["pokemon"]["url"])
    });
  }, []);

  async function setFavorite() {
    if (!await auth.checkSession()) {
      navigate("/login");
      return;
    }

    await fetch(backend("user/set-fav"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ "pkmn_id": speciesInfo.pkmnId })
    });
    navigate("/user/me");
  }

  return (
    <div className="page-container">
      <h1 className="page-title">{titleCase(name)} <span id="pkmn-id">#{speciesInfo.pkmnId}</span></h1>
      <button id="set-fav-button" onClick={setFavorite}>I choose you!</button>
      <PokemonDisplay {...speciesInfo} />
    </div>
  );
}

export default Pokemon;
