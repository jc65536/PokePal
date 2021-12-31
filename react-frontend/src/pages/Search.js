import React from "react"
import { Link } from "react-router-dom";

import { backend, pokeapi, setTitle, titleCase, toParams, uppercase } from "../util";
import Checklist from "../components/Checklist";

import "../css/Search.css";

const RESULTS_PER_PAGE = 30;

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
    setTitle("Search");
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
      "q": this.state.query.toLowerCase().trim();
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
    event.preventDefault();

    const id = event.target.id;
    const currentPage = this.state.page;

    if (event.target.classList.contains("disabled"))
      return;

    if (id == "prev" && currentPage > 0) {
      this.setState({ page: currentPage - 1 });
    } else if (id == "next" && currentPage < this.state.pageCount - 1) {
      this.setState({ page: currentPage + 1 });
    }
  }

  render() {
    const resultItems = [];
    const pageStart = RESULTS_PER_PAGE * this.state.page;
    for (let i = pageStart; i < pageStart + RESULTS_PER_PAGE && i < this.state.count; i++) {
      const result = this.state.results[i];
      resultItems.push(
        <li className="result" key={"result-" + result["name"]}>
          <Link to={`/pokemon/${result["name"]}`}>
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result["id"]}.png`} />
            {titleCase(result["name"])}
          </Link>
        </li>
      );
    }

    return (
      <div className="page-container">
        <h1 className="page-title">Search all Pokemon</h1>
        <form onSubmit={this.handleSubmit}>
          <div id="search-input-container">
            <input id="search-input" value={this.state.query} onChange={this.handleTextChange} />
            <input type="submit" value="Search"></input>
          </div>
          <Checklist id="gens" title="Generations" itemNames={this.state.genNames} onChange={this.handleChecklistChange} labelFormat={uppercase} />
          <Checklist id="types" title="Types" itemNames={this.state.typeNames} onChange={this.handleChecklistChange} labelFormat={titleCase} />
        </form>
        <div id="paginator">
          <a id="prev" href="#" className={this.state.page == 0 ? "disabled" : null} onClick={this.switchPage}>&lt; Prev</a>
          <span>Page {this.state.pageCount == 0 ? 0 : this.state.page + 1} of {this.state.pageCount}</span>
          <a id="next" href="#" className={this.state.page >= this.state.pageCount - 1 ? "disabled" : null} onClick={this.switchPage}>Next &gt;</a>
        </div>
        <ul id="results-container">{resultItems}</ul>
      </div>
    );
  }
}

export default Search;
