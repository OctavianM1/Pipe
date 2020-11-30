import React from "react";
import useDocumentTitle from "../../Hooks/useDocumentTitle";

import "./notFound.scss";

const NotFound = () => {
  useDocumentTitle("Not Found", []);

  return (
    <div className="not-found">
      <img src="/images/not-found/404.png" alt="Not Found" />
      <div>
        <h1>404 Page Not Found</h1>
        <p>
          Sorry, we couldn't find this page. But don't worry, you can find
          plenty of other things on our <a href="/">homepage</a>.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
