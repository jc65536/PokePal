import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Link to="/user/me">My profile</Link>
    </div>
  );
}

export default Home;
