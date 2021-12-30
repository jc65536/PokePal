import React from "react"
import { Link } from "react-router-dom";

import { backend, pokeapi, titleCase, toParams, uppercase } from "../util";
import Checklist from "../components/Checklist";

const RESULTS_PER_PAGE = 20;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      gens: [],
      types: [],
      count: 0,
      results: [],
      page: 0,
      pageCount: 0,
      genNames: [],
      typeNames: []
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleChecklistChange = this.handleChecklistChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.storeResults = this.storeResults.bind(this);
    this.switchPage = this.switchPage.bind(this);
  }

  componentDidMount() {
    fetch(pokeapi("generation"))
      .then(res => res.json())
      .then(json => this.setState({ genNames: json["results"].map(gen => gen["name"].split("-")[1]) }));

    fetch(pokeapi("type"))
      .then(res => res.json())
      .then(json => this.setState({ typeNames: json["results"].map(type => type["name"]) }));

    fetch(backend("search"))
      .then(res => res.json())
      .then(this.storeResults);
  }

  storeResults(json) {
    const count = json["count"];
    this.setState({
      count: count,
      results: json["results"],
      pageCount: Math.ceil(count / RESULTS_PER_PAGE),
      page: 0
    });
  }

  handleTextChange(event) {
    this.setState({ query: event.target.value });
  }

  handleChecklistChange(id, checkedItems) {
    this.setState({ [id]: checkedItems }, this.handleSubmit);
  }

  handleSubmit(event) {
    const fullQuery = {
      "q": this.state.query
    };
    if (this.state.gens.length > 0)
      fullQuery["gens"] = this.state.gens.join(",");
    if (this.state.types.length > 0)
      fullQuery["types"] = this.state.types.join(",");

    fetch(backend("search") + "?" + toParams(fullQuery))
      .then(res => res.json())
      .then(this.storeResults);

    if (event)
      event.preventDefault();
  }

  switchPage(event) {
    const id = event.target.id;
    const currentPage = this.state.page;

    if (event.target.classList.contains("disabled"))
      return;

    if (id == "prev" && currentPage > 0) {
      this.setState({ page: currentPage - 1 });
    } else if (id == "next" && currentPage < this.state.pageCount - 1) {
      this.setState({ page: currentPage + 1 });
    }

    event.preventDefault();
  }

  render() {
    const resultItems = [];
    const pageStart = RESULTS_PER_PAGE * this.state.page;
    for (let i = pageStart; i < pageStart + RESULTS_PER_PAGE && i < this.state.count; i++) {
      const result = this.state.results[i];
      resultItems.push(
        <li key={"result-" + result["name"]}>
          <Link to={`/pokemon/${result["name"]}`}>
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result["id"]}.png`} />
            {titleCase(result["name"])}
          </Link>
        </li>
      );
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Search
            <input id="query" value={this.state.query} onChange={this.handleTextChange} />
          </label>
          <input type="submit" value="Search"></input>
          <Checklist id="gens" itemNames={this.state.genNames} onChange={this.handleChecklistChange} labelFormat={uppercase} />
          <Checklist id="types" itemNames={this.state.typeNames} onChange={this.handleChecklistChange} labelFormat={titleCase} />
        </form>
        <div id="paginator">
          <button id="prev" className={this.state.page == 0 ? "disabled" : null} onClick={this.switchPage}>Prev</button>
          Page {this.state.pageCount == 0 ? 0 : this.state.page + 1} of {this.state.pageCount}
          <button id="next" className={this.state.page >= this.state.pageCount - 1 ? "disabled" : null} onClick={this.switchPage}>Next</button>
        </div>
        <ul>{resultItems}</ul>
      </div>
    );
  }
}

export default Search;
