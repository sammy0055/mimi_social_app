import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Redux from "./redux/Redux";

ReactDOM.render(
  <Redux>
    <App />
  </Redux>,
  document.getElementById("root")
);
