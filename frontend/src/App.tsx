import React from "react";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
import Auth0Lock from "auth0-lock";

import apollo from "./apollo";
import store from "./store";

import logo from "./logo.svg";
import "./App.css";

const lock = new Auth0Lock(
  "mZeX1QFQKvmzwjZKYRcvmzYsO8d1Ygox",
  "community-expenses-dev.eu.auth0.com"
);
lock.on("authenticated", (authResult: AuthResult) => {
  localStorage.setItem("_authToken", authResult.idToken);
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={apollo}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <button
              className="App-link"
              onClick={event => {
                event.preventDefault();
                lock.show();
              }}
            >
              Learn React
            </button>
          </header>
        </div>
      </ApolloProvider>
    </Provider>
  );
};

export default App;
