import { ReceiptModel, BudgetCategory } from "./ReceiptNew.scene";

export const formSchemaValidator = (model: ReceiptModel) => {
  const {
    date,
    amount,
    pay_to_iban,
    pay_to_notes,
    budget_allocations,
    budget_category,
    has_multiple_categories
  } = model;
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

  if (has_multiple_categories) {
    if (
      typeof budget_allocations !== "object" ||
      budget_allocations.length === 0
    ) {
      details.push({
        name: "has_multiple_categories",
        message: "Please enter at least 1 budget category"
      });
    } else {
      const total_allocations = budget_allocations.reduce(
        (a, b) => a + b.amount,
        0
      );

      const isOverBudget = total_allocations > amount;

      budget_allocations?.forEach((budget_allocation, i) => {
        const { amount, budget_category } = budget_allocation;
        if (!amount || amount === 0) {
          details.push({
            name: `budget_allocations.${i}.amount`,
            message: "Please enter an amount for this budget category"
          });
        }

        if (!budget_category) {
          details.push({
            name: `budget_allocations.${i}.budget_category`,
            message: "Please select a budget category"
          });
        }

        if (isOverBudget) {
          details.push({
            name: `budget_allocations.${i}.amount`,
            message: "Please allocate less than the total receipt amount"
          });
        }
      });
    }
  } else {
    if (!budget_category) {
      details.push({
        name: "budget_category",
        message: "Please allocate this receipt to at least 1 budget category."
      });
    }
  }

  if (details.length) {
    // eslint-disable-next-line no-throw-literal
    throw { details };
  }
};

const getBudgetCategoryFactory = (budget_categories: BudgetCategory[]) => (
  name?: string
): BudgetCategory => {
  const budget_category = budget_categories.find(budget_category => {
    return name === budget_category.name;
  });

  if (!budget_category) {
    throw new Error("Unable to find budget category ID. #9gNLUG");
  }

  return budget_category;
};

export const getBudgetAllocationsFromModel = (
  model: ReceiptModel,
  budget_categories: BudgetCategory[]
) => {
  const {
    amount,
    budget_category,
    has_multiple_categories,
    budget_allocations
  } = model;

  const getBudgetCategory = getBudgetCategoryFactory(budget_categories);

  if (has_multiple_categories) {
    const { id: budget_category_id } = getBudgetCategory(budget_category);
    const amount_cents = Math.round(amount * 100);
    return {
      budget_category_id,
      amount_cents
    };
  }

  if (!budget_allocations) {
    throw new Error("You must choose at least one budget category. #3aVtwL");
  }

  return budget_allocations.map(
    (budget_allocation: { budget_category?: string; amount: number }) => {
      const { id: budget_category_id } = getBudgetCategory(
        budget_allocation.budget_category
      );

      return {
        budget_category_id,
        amount_cents: Math.round(budget_allocation.amount * 100)
      };
    }
  );
};
