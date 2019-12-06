import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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

import Bar from "../Bar/Bar.scene";
import Profile from "../Profile/Profile.scene";
import ReceiptIndex from "../ReceiptIndex/ReceiptIndex.scene";
import ReceiptNew from "../ReceiptNew/ReceiptNew.scene";

const baseTheme = createMuiTheme();
const theme = responsiveFontSizes(baseTheme);

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
        <Bar />
        <CssBaseline />
        <Container>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/receipts/new" component={ReceiptNew} />
            <Route path="/receipts" component={ReceiptIndex} />
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
