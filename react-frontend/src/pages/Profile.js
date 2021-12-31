import React from "react";
import { Link, Navigate } from "react-router-dom";
import PokemonDisplay from "../components/PokemonDisplay";

import { backend, pokeapi, setTitle, titleCase } from "../util";
import { AuthContext } from "../AuthContext";
import "../css/Profile.css";
import StandardPage from "../components/StandardPage";

class Profile extends React.Component {
  static contextType = AuthContext;
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: "",
        favorite: 0
      },
      speciesInfo: {}
    }
  }

  componentDidMount() {
    this._isMounted = true;
    setTitle("Me")

    if (!this.context.loggedIn)
      return;

    fetch(backend("user/profile"), { credentials: "include" })
      .then(res => res.json())
      .then(userJson => {
        if (!this._isMounted)
          return;

        this.setState({ user: userJson });

        if (userJson["favorite"] == 0)
          return;

        fetch(pokeapi("pokemon-species/" + userJson["favorite"]))
          .then(res => res.json())
          .then(pkmnJson => {
            if (!this._isMounted)
              return;

            const flavorTexts = pkmnJson["flavor_text_entries"].filter(e => e["language"]["name"] == "en");
            this.setState({
              speciesInfo: {
                name: pkmnJson["name"],
                pkmnId: pkmnJson["id"],
                flavorText: flavorTexts[flavorTexts.length - 1]["flavor_text"],
                color: pkmnJson["color"]["name"],
                varietyUrls: pkmnJson["varieties"].map(e => e["pokemon"]["url"])
              }
            });
          });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const speciesInfo = this.state.speciesInfo;

    if (!this.context.loggedIn)
      return <Navigate to="/login" replace />

    let favoriteDisplay;
    if (this.state.user.favorite == 0) {
      favoriteDisplay = <div>You haven't set a favorite yet!</div>
    } else {
      favoriteDisplay = <>
        <p id="greeting">Your PokePal is waiting for you!</p>
        <Link to={`/pokemon/${speciesInfo.name}`} id="species-link">
          <h2>{titleCase(speciesInfo.name)} <span id="pkmn-id">#{speciesInfo.pkmnId}</span></h2>
        </Link>
        <PokemonDisplay {...speciesInfo} />
      </>
    }

    return (
      <StandardPage title={`Hello ${this.state.user.username},`} >
        {favoriteDisplay}
      </StandardPage>
    );
  }
}

export default Profile;
