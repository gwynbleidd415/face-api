import React from "react";
import ReactDOM from "react-dom";
import App from "./container/App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
// eslint-disable-next-line
import tachyons from "tachyons";
import "./index.css";

ReactDOM.render(
  //<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  //</React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
