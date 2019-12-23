# Hasura

To see the total budget allocations per category one can use a query like so:

```sql
SELECT budget_categories.id, budget_categories.name, budget_categories.budget_cents, SUM(receipt_budget_category_allocations.amount_cents) AS total_allocated_amount_cents
FROM budget_categories
INNER JOIN receipt_budget_category_allocations
ON budget_categories.id = receipt_budget_category_allocations.budget_category_id
GROUP BY budget_categories.id;
```

This can be run in the Hasura console (Date > SQL).

One can also retrieve the same data with an aggregate query in GraphQL:

```graphql
{
  budget_categories {
    id
    name
    receipt_budget_category_allocations_aggregate(
      distinct_on: budget_category_id
    ) {
      aggregate {
        sum {
          amount_cents
        }
      }
    }
  }
}
```
