import { useEffect } from "react";
import { Link } from "react-router-dom";
import StandardPage from "../components/StandardPage";
import { setTitle } from "../util";

function Home() {
  useEffect(() => {
    setTitle("");
  }, []);

  return (
    <StandardPage title="Welcome to the world of Pokemon!">
      <Link to="/search" id="home-link"><h2>Find a PokePal</h2></Link>
    </StandardPage >
  );
}

export default Home;
