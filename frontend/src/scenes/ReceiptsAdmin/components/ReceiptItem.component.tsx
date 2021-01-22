import React from "react";
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { ReceiptReturn } from "../ReceiptsAdmin.scene";

const CONFIRM_WARNING = `\n\nThis action is irreversible. There is no option to undo.`;

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
  setPaperCopyReceived: () => void;
  setHasBeenPaid: () => void;
};

const ReceiptItem = (props: Props) => {
  const { receipt, classes } = props;

  const category_names = receipt.budget_allocations.map(
    (allocation) => allocation.budget_category.name
  );

  return (
    <Paper key={receipt.id} className={classes.padder}>
      <div>
        <Link to={`/receipts/${receipt.id}`}>Number: {receipt.number}</Link>
      </div>
      <div>Amount: €{(receipt.amount_cents / 100).toFixed(2)}</div>
      <div>Description: {receipt.description}</div>
      <div>
        Name: {receipt.user_profile?.name} ({receipt.user_profile?.email} /{" "}
        {receipt.user_profile?.phone_number})
      </div>
      <div>Budget categories: {category_names.join("; ")}</div>
      <div>Pay to name: {receipt.pay_to_name}</div>
      <div>Pay to IBAN: {receipt.pay_to_iban}</div>
      <div>Pay to notes: {receipt.pay_to_notes}</div>
      <div>
        Legally compliant:{" "}
        {isLegallyCompliantText(receipt.is_legally_compliant)}{" "}
        {receipt.is_legally_compliant === null ? (
          <>
            <Button
              size="small"
              variant="contained"
              className={classes.markLegallyValid}
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to mark receipt number ${receipt.number} as LEGALLY VALID?${CONFIRM_WARNING}`
                  )
                ) {
                  props.setIsLegallyCompliant(true);
                }
              }}
            >
              Mark legally VALID
            </Button>{" "}
            <Button
              size="small"
              variant="contained"
              className={classes.markLegallyInvalid}
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to mark receipt number ${receipt.number} as LEGALLY INVALID?${CONFIRM_WARNING}`
                  )
                ) {
                  props.setIsLegallyCompliant(false);
                }
              }}
            >
              Mark legally INVALID
            </Button>
          </>
        ) : null}
      </div>
      <div>
        Paper received: {receipt.paper_copy_received ? "Yes" : "No"}{" "}
        {receipt.paper_copy_received ? null : (
          <Button
            size="small"
            variant="contained"
            color="inherit"
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to mark receipt number ${receipt.number} PAPER COPY RECEIVED?${CONFIRM_WARNING}`
                )
              ) {
                props.setPaperCopyReceived();
              }
            }}
          >
            Mark Paper Received
          </Button>
        )}
      </div>
      <div>
        Payment status: {receipt.has_been_paid ? "Sent" : "Pending"}{" "}
        {receipt.has_been_paid ? null : (
          <Button
            size="small"
            variant="contained"
            color="inherit"
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to mark receipt number ${receipt.number} as PAID?${CONFIRM_WARNING}`
                )
              ) {
                props.setHasBeenPaid();
              }
            }}
          >
            Mark Payment Sent
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default ReceiptItem;
