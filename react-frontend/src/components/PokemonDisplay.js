import React, { useState, useEffect } from "react";
import VarietiesGallery from "./VarietiesGallery";
import { pokeapi, titleCase } from "../util";

class PokemonDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      varieties: []
    };
  }

  async componentDidUpdate(oldProps) {
    if (this.props.varietyUrls == oldProps.varietyUrls)
      return;

    const varietyHolder = Array.apply(null, Array(this.props.varietyUrls.length));
    await Promise.all(this.props.varietyUrls.map(async (url, index) =>
      fetch(url).then(res => res.json()).then(json => {
        // No support for forms as of now
        const varietyName = titleCase(json["name"].replaceAll("-", " "));
        const artUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json["id"]}.png`;
        varietyHolder[index] = {
          name: varietyName,
          artUrl: artUrl
        };
      })
    ));
    this.setState({ varieties: varietyHolder });
  }

  render() {
    return (
      <div>
        <div className="varieties-gallery" >
          {this.state.varieties.map(variety =>
            <figure key={variety["name"]}>
              <img src={variety["artUrl"]} />
              <figcaption>{variety["name"]}</figcaption>
            </figure>
          )}
        </div>
        <p>{this.props.flavorText}</p>
        <p>{this.props.color}</p>
        <p>{this.props.pkmnId}</p>
      </div>
    );
  }
}

export default PokemonDisplay;
