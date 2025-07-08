import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import './index.css';
import { BrowserRouter } from "react-router-dom";
import TokenLoader from "./components/TokenLoader"; // ✅

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TokenLoader>
          <App />
        </TokenLoader>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
