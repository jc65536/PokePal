import { useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "../components/StandardPage";
import { setTitle } from "../util";

function Home() {
  useEffect(() => {
    setTitle("");
  }, []);

  return (
    <Page title="Welcome to the world of Pokemon!">
      <Link to="/search" id="home-link"><h2>Find a PokePal</h2></Link>
    </Page >
  );
}

export default Home;
