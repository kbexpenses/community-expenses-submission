import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";

import { Theme, createStyles } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

import { userHasRole } from "../../services/auth/auth.service";
import ReceiptItem from "./components/ReceiptItem.component";

export type ReceiptReturn = {
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
      {receipts.map((receipt: ReceiptReturn) => (
        <ReceiptItem key={receipt.id} receipt={receipt} classes={classes} />
      ))}
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
