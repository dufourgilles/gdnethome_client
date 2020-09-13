import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./utils/Config";
import App from "./components/App";
import store from "./store/GDNetHomeClientStore";
import GlobalStyle from "./GlobalStyle";
import "overlayscrollbars/css/OverlayScrollbars.css";

console.log("Starting");
render(
  <GlobalStyle>
    <Provider store={store}>
      <BrowserRouter>
        <Route path="/" component={App} />
      </BrowserRouter>
    </Provider>
  </GlobalStyle>,
  document.getElementById("root")
);
