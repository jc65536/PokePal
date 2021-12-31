import { useEffect } from "react";
import { setTitle } from "../util";

function StandardPage({ title, children }) {
  useEffect(() => {
    setTitle(title);
  }, [title]);

  return (
    <div className="page-container">
      <h1 className="page-title">{title}</h1>
      {children}
    </div>
  );
}

export default StandardPage;
