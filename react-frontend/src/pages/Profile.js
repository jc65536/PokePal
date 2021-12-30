import React from "react";
import { Navigate } from "react-router-dom";
import PokemonDisplay from "../components/PokemonDisplay";

import { backend, pokeapi } from "../util";

function logout() {
  fetch(backend("logout"), {
    method: "POST",
    credentials: "include"
  });
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: null,
      user: {},
      speciesInfo: {}
    }
  }

  componentDidMount() {
    fetch(backend("user/profile"), { credentials: "include" }).then(res => {
      if (res.status < 400) {
        this.setState({ authorized: true });
        return res.json();
      } else {
        this.setState({ authorized: false });
        return Promise.reject();
      }
    }).then(userJson => {
      this.setState({ user: userJson });

      if (userJson["favorite"] == 0)
        return;

      fetch(pokeapi("pokemon-species/" + userJson["favorite"]))
        .then(res => res.json())
        .then(pkmnJson => {
          const flavorTexts = pkmnJson["flavor_text_entries"].filter(e => e["language"]["name"] == "en");
          this.setState({
            speciesInfo: {
              pkmnId: pkmnJson["id"],
              flavorText: flavorTexts[flavorTexts.length - 1]["flavor_text"],
              color: pkmnJson["color"]["name"],
              varietyUrls: pkmnJson["varieties"].map(e => e["pokemon"]["url"])
            }
          });
        });
    });
  }

  render() {
    if (this.state.authorized == null)
      return null

    if (!this.state.authorized)
      return <Navigate to="/login" replace />

    let favoriteDisplay;
    if (this.state.user.favorite == 0) {
      favoriteDisplay = <div>You haven't set a favorite yet!</div>
    } else {
      favoriteDisplay = <PokemonDisplay {...this.state.speciesInfo} />
    }

    return (
      <div>
        Hello, {this.state.user.username}!<br />
        {favoriteDisplay}
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
}

export default Profile;
