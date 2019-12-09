import {
  ReceiptReturn,
  IS_LEGALLY_COMPLIANT,
  PAPER_COPY_RECEIVED,
  HAS_BEEN_PAID
} from "./ReceiptsAdmin.scene";

export const applySearchToReceipts = (
  search: string,
  receipts: ReceiptReturn[]
) => {
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

export const applyFilterToReceipts = (
  filter: string,
  receipts: ReceiptReturn[]
) => {
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
    }

    if (filter === PAPER_COPY_RECEIVED) {
      if (receipt.paper_copy_received !== true) {
        return true;
      }
    }

    if (filter === HAS_BEEN_PAID) {
      if (receipt.has_been_paid !== true) {
        return true;
      }
    }

    return false;
  });
};
