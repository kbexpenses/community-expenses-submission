import React from "react";

import {
  Button,
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core";

import { showLock } from "../../services/auth/auth.service";
import { AppState } from "../../store";

const Home = (props: Props) => {
  const { classes, isLoggedIn } = props;

  return (
    <div className={classes.container}>
      <p>Login to get started.</p>
      <Button
        variant="contained"
        size="large"
        onClick={event => {
          event.preventDefault();
          showLock();
        }}
      >
        Login or Sign Up
      </Button>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingTop: "10vh",
      textAlign: "center",
      fontSize: "3em"
    }
  });

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & WithStyles<typeof styles>;

export default withStyles(styles)(Home);
