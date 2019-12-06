import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Auth0Lock from "auth0-lock";
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  createMuiTheme
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Profile from "../Profile/Profile.scene";

const baseTheme = createMuiTheme();
const theme = responsiveFontSizes(baseTheme);

const lock = new Auth0Lock(
  "mZeX1QFQKvmzwjZKYRcvmzYsO8d1Ygox",
  "community-expenses-dev.eu.auth0.com"
);
lock.on("authenticated", (authResult: AuthResult) => {
  localStorage.setItem("_authToken", authResult.idToken);
});

const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
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
  );
};

const Routes = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Container>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      flexGrow: 1
    }
  });

type Props = WithStyles<typeof styles>;

export default withStyles(styles)(Routes);
