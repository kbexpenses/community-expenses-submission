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
import ReceiptAdmin from "../ReceiptsAdmin/ReceiptsAdmin.scene";

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
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/receipts" component={ReceiptIndex} />
            <Route exact path="/receipts/new" component={ReceiptNew} />
            <Route exact path="/receipts/admin" component={ReceiptAdmin} />
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
