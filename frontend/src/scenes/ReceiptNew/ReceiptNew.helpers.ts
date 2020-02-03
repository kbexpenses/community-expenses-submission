import { ReceiptModel } from "./ReceiptNew.scene";

export const formSchemaValidator = (model: ReceiptModel ) => {
  const { date, amount, pay_to_iban, pay_to_notes, budget_allocations, budget_category, multiple_categories } = model;
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

  // Selected more than 1 category & failed to enter a budget category
  const budgetAllocationsCategoryErrorIndex = (
    budget_allocations && budget_allocations.findIndex(allocation => !allocation.budget_category)
  ) || 0;
  if (
    multiple_categories && budget_allocations && (
      budget_allocations.length === 0
      || budgetAllocationsCategoryErrorIndex > -1
    )
  ) {
    details.push({
      name: `budget_allocations.${budgetAllocationsCategoryErrorIndex}.budget_category`,
      message: "Please select a budget category."
    });
  }

  if (!multiple_categories && !budget_category) {
    details.push({
      name: "budget_category",
      message: "Please allocate this receipt to at least 1 budget category."
    });
  }

  // Selected more than 1 category & failed to enter an amount
  const budgetAmountErrorIndex = (
    budget_allocations && budget_allocations.findIndex(allocation => !allocation.amount)
  ) || 0;
  if (
    multiple_categories && budget_allocations
      && budget_allocations.length > 1
      && budgetAmountErrorIndex > -1
  ) {
    details.push({
      name: `budget_allocations.${budgetAmountErrorIndex}.amount`,
      message: "Please allocate an amount for each budget category"
    });
  }

  // Amounts of multiple budget categories add up to more than the total amount
  const total_allocations = multiple_categories && budget_allocations ?
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
