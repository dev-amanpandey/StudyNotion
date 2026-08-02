import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import{ BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {rootReducer} from "./reducer";
import {configureStore} from "@reduxjs/toolkit";
import {Toaster} from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";


const store = configureStore({
  reducer:rootReducer,
});
const root = ReactDOM.createRoot(document.getElementById("root"));
const application = (
  <Provider store = {store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
)
//console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
root.render(
  // Google Identity Services is initialized imperatively by its SDK. Rendering
  // it in StrictMode initializes the SDK twice in development and causes GSI
  // warnings / inconsistent popup behavior.
  process.env.REACT_APP_GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {application}
    </GoogleOAuthProvider>
  ) : application
);
