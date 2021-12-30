import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { backend, pokeapi, titleCase } from "../util";
import VarietiesGallery from "../components/VarietiesGallery";
import PokemonDisplay from "../components/PokemonDisplay";

function Pokemon() {
  const { name } = useParams();
  const [speciesInfo, setSpeciesInfo] = useState({});

  useEffect(() => {
    fetch(pokeapi("pokemon-species/" + name))
      .then(res => res.json())
      .then(json => {
        const flavorTexts = json["flavor_text_entries"].filter(e => e["language"]["name"] == "en");
        setSpeciesInfo({
          pkmnId: json["id"],
          flavorText: flavorTexts[flavorTexts.length - 1]["flavor_text"],
          color: json["color"]["name"],
          varietyUrls: json["varieties"].map(e => e["pokemon"]["url"])
        });
      });
  }, []);

  function setFavorite() {
    fetch(backend("user/set-fav"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ "pkmn_id": speciesInfo.pkmnId })
    });
  }

  return (
    <div>
      <PokemonDisplay {...speciesInfo} />
      <button onClick={setFavorite}>I choose you</button>
    </div>
  );
}

export default Pokemon;
