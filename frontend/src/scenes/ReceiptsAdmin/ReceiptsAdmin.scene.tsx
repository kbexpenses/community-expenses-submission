import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";

import { Theme, createStyles, Button } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";

import { userHasRole } from "../../services/auth/auth.service";
import ReceiptItem from "./components/ReceiptItem.component";

const IS_LEGALLY_COMPLIANT = "is_legally_compliant";
const PAPER_COPY_RECEIVED = "paper_copy_received";
const HAS_BEEN_PAID = "has_been_paid";

export type ReceiptReturn = {
  id: string;
  user_id: string;
  number: number;
  amount_cents: number;
  is_legally_compliant?: boolean;
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
      is_legally_compliant
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

const applyFilterToReceipts = (filter: string, receipts: ReceiptReturn[]) => {
  if (filter === "") {
    return receipts;
  }

  return receipts.filter(receipt => {
    if (filter === IS_LEGALLY_COMPLIANT) {
      if (
        receipt.is_legally_compliant !== false &&
        receipt.is_legally_compliant !== true
      ) {
        return true;
      }
      return false;
    }

    if (filter === PAPER_COPY_RECEIVED) {
      if (receipt.paper_copy_received !== true) {
        return true;
      }
      return false;
    }

    if (filter === HAS_BEEN_PAID) {
      if (receipt.has_been_paid !== true) {
        return true;
      }
      return false;
    }
  });
};

const ReceiptAdmin = (props: Props) => {
  const { classes } = props;

  const [filter, setFilter] = useState("");
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

  const filteredReceipts = applyFilterToReceipts(filter, data.receipts);
  const receipts = applySearchToReceipts(search, filteredReceipts);

  return (
    <div>
      <h2>Receipts</h2>
      <Paper className={classes.padder}>
        <h3>Filter</h3>
        <p>
          <Button
            className={
              filter === IS_LEGALLY_COMPLIANT ? classes.green : classes.grey
            }
            variant="contained"
            onClick={() => {
              setFilter(
                filter === IS_LEGALLY_COMPLIANT ? "" : IS_LEGALLY_COMPLIANT
              );
            }}
          >
            Waiting for legal validation
          </Button>{" "}
          <Button
            className={
              filter === PAPER_COPY_RECEIVED ? classes.green : classes.grey
            }
            variant="contained"
            onClick={() => {
              setFilter(
                filter === PAPER_COPY_RECEIVED ? "" : PAPER_COPY_RECEIVED
              );
            }}
          >
            Waiting for legal validation
          </Button>{" "}
          <Button
            className={filter === HAS_BEEN_PAID ? classes.green : classes.grey}
            variant="contained"
            onClick={() => {
              setFilter(filter === HAS_BEEN_PAID ? "" : HAS_BEEN_PAID);
            }}
          >
            Waiting for payment
          </Button>
        </p>
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
    green: {
      backgroundColor: green[500],
      "&:hover": {
        backgroundColor: green[500]
      }
    },
    grey: {
      backgroundColor: grey[200],
      "&:hover": {
        backgroundColor: grey[200]
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
