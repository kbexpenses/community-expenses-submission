import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { AppState } from "../../store";
import { showLock } from "../../services/auth/auth.service";
import { doesUserHaveRole } from "../../services/auth/auth.state";

const Bar: React.FC<Props> = (props: Props) => {
  const { classes, isAdmin } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Link to="/" className={classes.title}>
            <Typography variant="h6" component="h1" color="inherit">
              Community Expenses
            </Typography>
          </Link>
          {isAdmin ? (
            <Link to="/receipts/admin">
              <Button color="inherit">Receipts</Button>
            </Link>
          ) : null}
          <Link to="/receipts">
            <Button color="inherit">My Receipts</Button>
          </Link>
          <Link to="/budget">
            <Button color="inherit">Budget</Button>
          </Link>
          <Link to="/profile">
            <Button color="inherit">Profile</Button>
          </Link>
          <Button
            color="inherit"
            onClick={() => {
              showLock();
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    isAdmin: doesUserHaveRole(state, "admin")
  };
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    title: {
      flexGrow: 1
    }
  });

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & WithStyles<typeof styles>;

export default connect(mapStateToProps)(withStyles(styles)(Bar));
