import { ReceiptModel } from "./ReceiptNew.scene";

export const formSchemaValidator = (model: ReceiptModel) => {
  const { date, amount, pay_to_iban, pay_to_notes, budget_allocations, budget_category } = model;
  const details = [];

  if (!amount) {
    details.push({
      name: "amount",
      message: "Please specify the amount of this receipt"
    });
  }
  if (!date) {
    details.push({
      name: "date",
      message: "Please enter the date on the receipt"
    });
  }
  if (!pay_to_iban && !pay_to_notes) {
    details.push({
      name: "pay_to_iban",
      message:
        "Please enter the IBAN of where we should pay, or specify a note instead."
    });
  }
  if (
    (budget_allocations && (budget_allocations.length === 0 || !budget_allocations[0].budget_category)) ||
    (!budget_allocations && !budget_category)
  ) {
    details.push({
      name: "budget_allocations.0.budget_category",
      message: "Please allocate this receipt to at least 1 budget category."
    });
  }
  const total_allocations = budget_allocations ?
    budget_allocations.reduce(
      (a, b) => a + b.amount,
      0
    ) : amount;
  if (total_allocations > amount) {
    details.push({
      name: "budget_allocations.0.amount",
      message: "Please allocate less than the total receipt amount"
    });
  }

  if (details.length) {
    // eslint-disable-next-line no-throw-literal
    throw { details };
  }
};
