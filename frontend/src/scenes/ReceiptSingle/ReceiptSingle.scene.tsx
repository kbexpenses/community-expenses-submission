import React from "react";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import { useQuery } from "react-apollo";
import AuthImage from "../../components/AuthImage";

const ReceiptSingleQuery = gql`
  query ReceiptSingleQuery($id: uuid!) {
    receipts_by_pk(id: $id) {
      id
      user_id
      number
      date
      file_url
      amount_cents
      pay_to_name
      pay_to_iban
      budget_allocations {
        id
        amount_cents
        budget_category {
          id
          name
        }
      }
    }
  }
`;

type ReceiptReturn = {
  id: string;
  user_id: string;
  number: number;
  date: string;
  file_url: string;
  amount_cents: number;
  pay_to_name: string;
  pay_to_iban: string;
  budget_allocations?: {
    id: string;
    amount_cents: number;
    budget_category: {
      id: string;
      name: string;
    };
  }[];
};

const ReceiptSingle = (props: Props) => {
  const id = props.match.params.id;

  const { loading, error, data } = useQuery(ReceiptSingleQuery, {
    variables: { id }
  });

  if (error) {
    return (
      <div>
        <p>Error #oHWwFx: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const receipt: ReceiptReturn = data.receipts_by_pk;

  if (!receipt) {
    return (
      <div>
        <p>Not found. #9MskPK</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Receipt {receipt.number}</h1>
      <AuthImage file_url={receipt.file_url} />
      <p>Receipt Number: {receipt.number}</p>
      <p>Receipt date: {receipt.date}</p>
      <p>Amount: €{(receipt.amount_cents / 100).toFixed(2)}</p>
      <p>Pay to Name: {receipt.pay_to_name}</p>
      <p>Pay to IBAN: {receipt.pay_to_iban}</p>
      <p>Categories</p>
      <ul>
        {receipt?.budget_allocations?.map(allocation => {
          return (
            <li key={allocation.id}>
              {allocation.budget_category.name} (€
              {(allocation.amount_cents / 100).toFixed(2)})
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface RouteProps {
  id: string;
}
type Props = RouteComponentProps<RouteProps>;

export default ReceiptSingle;
