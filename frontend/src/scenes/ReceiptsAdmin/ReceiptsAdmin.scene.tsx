import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Link, Redirect } from "react-router-dom";

import { Theme, createStyles } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

import { getUserId, userHasRole } from "../../services/auth/auth.service";

type ReceiptReturn = {
  id: string;
  user_id: string;
  number: number;
  amount_cents: number;
  paper_copy_received?: boolean;
  has_been_paid?: boolean;
  pay_to_name?: string;
  pay_to_iban?: string;
  pay_to_notes?: string;
};

const ReceiptAdminQuery = gql`
  query ReceiptAdminQuery {
    receipts {
      id
      number
      amount_cents
      paper_copy_received
      has_been_paid
      pay_to_name
      pay_to_iban
      pay_to_notes
    }
  }
`;

const applySearchToReceipts = (search: string, receipts: ReceiptReturn[]) => {
  const lowerCaseSearch = search.toLowerCase();
  return receipts.filter((receipt: ReceiptReturn) => {
    if (receipt.number.toString().indexOf(search) !== -1) {
      return true;
    }
    if (
      receipt.pay_to_iban &&
      receipt.pay_to_iban.toLowerCase().indexOf(lowerCaseSearch) !== -1
    ) {
      return true;
    }
    if (
      receipt.pay_to_name &&
      receipt.pay_to_name.toLowerCase().indexOf(lowerCaseSearch) !== -1
    ) {
      return true;
    }
    if (
      receipt.pay_to_notes &&
      receipt.pay_to_notes.toLowerCase().indexOf(lowerCaseSearch) !== -1
    ) {
      return true;
    }
    return false;
  });
};

const ReceiptAdmin = (props: Props) => {
  const { classes } = props;

  const [search, setSearch] = useState("");
  const { loading, error, data } = useQuery(ReceiptAdminQuery);

  if (!userHasRole("admin")) {
    return <Redirect to="/" />;
  }

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error #iY20Jq: {error.message}</p>
      </div>
    );
  }

  const receipts = applySearchToReceipts(search, data.receipts);

  return (
    <div>
      <h2>Receipts</h2>
      <Paper className={classes.padder}>
        <h3>Search</h3>
        <p>
          Search:{" "}
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
            }}
          />
        </p>
      </Paper>
      {receipts.map((receipt: ReceiptReturn) => {
        return (
          <Paper key={receipt.id} className={classes.padder}>
            <div>Number: {receipt.number}</div>
            <div>Amount: €{(receipt.amount_cents / 100).toFixed(2)}</div>
            <div>Pay to name: {receipt.pay_to_name}</div>
            <div>Pay to IBAN: {receipt.pay_to_iban}</div>
            <div>Pay to notes: {receipt.pay_to_notes}</div>
            <div>
              Paper received: {receipt.paper_copy_received ? "Yes" : "No"}
            </div>
            <div>
              Payment status: {receipt.has_been_paid ? "Sent" : "Pending"}
            </div>
            <div>
              <Button
                size="small"
                variant="contained"
                className={classes.markLegallyValid}
              >
                Mark legally VALID
              </Button>
              <Button
                size="small"
                variant="contained"
                className={classes.markLegallyInvalid}
              >
                Mark legally INVALID
              </Button>
            </div>
            <div>
              <Button size="small" variant="contained" color="primary">
                Mark Paper Received
              </Button>
              <Button size="small" variant="contained" color="secondary">
                Mark Payment Sent
              </Button>
            </div>
          </Paper>
        );
      })}
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    padder: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    markLegallyValid: {
      backgroundColor: green[500],
      "&:hover": {
        backgroundColor: green[500]
      }
    },
    markLegallyInvalid: {
      backgroundColor: red[500],
      "&:hover": {
        backgroundColor: red[500]
      }
    }
  });

type Props = WithStyles<typeof styles>;

export default withStyles(styles)(ReceiptAdmin);
