import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { connect } from "react-redux";
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

import { AppState } from "../../store";

import Bar from "../Bar/Bar.scene";
import Home from "../Home/Home.scene";
import Profile, { ProfileQuery } from "../Profile/Profile.scene";
import { useQuery } from "@apollo/react-hooks";
import ReceiptIndex from "../ReceiptIndex/ReceiptIndex.scene";
import ReceiptNew from "../ReceiptNew/ReceiptNew.scene";
import ReceiptAdmin from "../ReceiptsAdmin/ReceiptsAdmin.scene";
import ReceiptSingle from "../ReceiptSingle/ReceiptSingle.scene";
import BudgetIndex from "../BudgetIndex/BudgetIndex.scene";

const baseTheme = createMuiTheme();
const theme = responsiveFontSizes(baseTheme);

export const history = createBrowserHistory();

const Routes = (props: Props) => {
  const { isLoggedIn } = props;
  const { data, refetch } = useQuery(ProfileQuery);
  const hasProfile = data ? data.user_profiles.length : false;

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Bar />
        <CssBaseline />
        <Container>
          {isLoggedIn ? (
            hasProfile ? (
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/receipts" component={ReceiptIndex} />
                <Route exact path="/receipts/new" component={ReceiptNew} />
                <Route exact path="/receipts/admin" component={ReceiptAdmin} />
                <Route exact path="/receipts/:id" component={ReceiptSingle} />
                <Route exact path="/budget" component={BudgetIndex} />
              </Switch>
            ) : (
              // If user hasn't created a profile, force them to
              <Profile promptUser={true} onSubmit={refetch} />
            )
          ) : (
            <>
              {/* <Redirect to="/" /> */}
              <Home />
            </>
          )}
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

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & WithStyles<typeof styles>;

export default connect(mapStateToProps)(withStyles(styles)(Routes));
