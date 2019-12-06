import React from "react";
import { Link } from "react-router-dom";
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { showLock } from "../../services/auth/auth.service";

const Bar: React.FC<Props> = (props: Props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Link to="/" className={classes.title}>
            <Typography variant="h6" component="h1" color="inherit">
              Community Expenses
            </Typography>
          </Link>
          <Link to="/receipts">
            <Button color="inherit">Receipts</Button>
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

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    title: {
      flexGrow: 1
    }
  });

type Props = WithStyles<typeof styles>;

export default withStyles(styles)(Bar);
