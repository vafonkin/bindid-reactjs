import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import Login from "./components/login/login";
import BindIDRedirect from "./components/redirect/redirect";
import reportWebVitals from "./reportWebVitals";
// Load Transmit Service Helper:
import TransmitService from "./ts/tsservice";

document.getElementById("bindid").addEventListener("load", () => {
  // DTM is loaded
  const tsService = new TransmitService();
  const hist = createBrowserHistory();

  const renderPage = () => {
    ReactDOM.render(
      <Router history={hist}>
        <Switch>
          <Route exact path="/">
            <Login tsService={tsService}></Login>
          </Route>
          <Route exact path="/redirect">
            <BindIDRedirect tsService={tsService}></BindIDRedirect>
          </Route>
        </Switch>
      </Router>,
      document.getElementById("root")
    );
  };

  tsService
    // SDK Initialization:
    .initializeBindIdSDK()
    .then((res) => {
      renderPage();
    })
    .catch((err) => {
      console.error(`Initialization error uccured: ${err.getMessage()}`);
    });

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
});
