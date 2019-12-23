import React from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";

const BudgetQuery = gql`
  query BudgetQuery {
    budget_categories {
      id
      name
      budget_cents
      receipt_budget_category_allocations_aggregate {
        aggregate {
          sum {
            amount_cents
          }
        }
      }
    }
  }
`;

const BudgetIndex = () => {
  const { error, loading, data } = useQuery<{
    budget_categories: {
      id: string;
      name: string;
      budget_cents: number;
      receipt_budget_category_allocations_aggregate: {
        aggregate: {
          sum: {
            amount_cents: number;
          };
        };
      };
    }[];
  }>(BudgetQuery);

  if (error) {
    return (
      <div>
        <p>Error #XztmzS: {error.message}</p>
      </div>
    );
  }
  if (loading || !data) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const { budget_categories } = data;

  return (
    <div>
      <h2>Budget Overview</h2>
      <ul>
        {budget_categories.map(budget_category => {
          return (
            <li key={budget_category.id}>
              <p>{budget_category.name}</p>
              <p>Budget: €{(budget_category.budget_cents / 100).toFixed(2)}</p>
              <p>
                Allocated: €
                {(
                  budget_category.receipt_budget_category_allocations_aggregate
                    .aggregate.sum.amount_cents / 100
                ).toFixed(2)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BudgetIndex;
