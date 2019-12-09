import React from "react";
import { ReceiptReturn } from "../ReceiptsAdmin.scene";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const isLegallyCompliantText = (is_legally_compliant?: boolean) => {
  if (is_legally_compliant === false) {
    return "No";
  } else if (is_legally_compliant === true) {
    return "Yes";
  } else {
    return "Unknown";
  }
};

type Props = {
  classes: { [name: string]: string };
  receipt: ReceiptReturn;
  setIsLegallyCompliant: (isLegallyCompliant: boolean) => void;
};

const ReceiptItem = (props: Props) => {
  const { receipt, classes } = props;

  return (
    <Paper key={receipt.id} className={classes.padder}>
      <div>Number: {receipt.number}</div>
      <div>Amount: €{(receipt.amount_cents / 100).toFixed(2)}</div>
      <div>Pay to name: {receipt.pay_to_name}</div>
      <div>Pay to IBAN: {receipt.pay_to_iban}</div>
      <div>Pay to notes: {receipt.pay_to_notes}</div>
      <div>
        Legally compliant:{" "}
        {isLegallyCompliantText(receipt.is_legally_compliant)}
      </div>
      <div>Paper received: {receipt.paper_copy_received ? "Yes" : "No"}</div>
      <div>Payment status: {receipt.has_been_paid ? "Sent" : "Pending"}</div>
      <div>
        <Button
          size="small"
          variant="contained"
          className={classes.markLegallyValid}
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              props.setIsLegallyCompliant(true);
            }
          }}
        >
          Mark legally VALID
        </Button>
        <Button
          size="small"
          variant="contained"
          className={classes.markLegallyInvalid}
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              props.setIsLegallyCompliant(false);
            }
          }}
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
};

export default ReceiptItem;
