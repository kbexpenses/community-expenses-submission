import React from "react";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import { useQuery } from "react-apollo";

const ReceiptSingleQuery = gql`
  query ReceiptSingleQuery($id: uuid!) {
    receipts_by_pk(id: $id) {
      id
      number
      date
      file_url
      amount_cents
      pay_to_name
      pay_to_iban
      user_id
    }
  }
`;

type ReceiptReturn = {
  id: string;
  number: number;
  date: string;
  file_url: string;
  amount_cents: number;
  pay_to_name: string;
  pay_to_iban: string;
  user_id: string;
};

const ReceiptSingle = (props: Props) => {
  const id = props.match.params.id;

  const { loading, error, data } = useQuery(ReceiptSingleQuery, {
    variables: { id }
  });

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
        <p>Error #oHWwFx: {error.message}</p>
      </div>
    );
  }

  const receipt: ReceiptReturn = data.receipts_by_pk;

  return (
    <div>
      <h1>Receipt Single</h1>
      <p>ID: {receipt.id}</p>
      <p>Receipt Number: {receipt.number}</p>
      <p>Receipt date: {receipt.date}</p>
      <p>Amount: €{(receipt.amount_cents / 100).toFixed(2)}</p>
      <p>Pay to: {receipt.pay_to_name}</p>
      <p>IBAN: {receipt.pay_to_iban}</p>
    </div>
  );
};

interface RouteProps {
  id: string;
}
type Props = RouteComponentProps<RouteProps>;

export default ReceiptSingle;
