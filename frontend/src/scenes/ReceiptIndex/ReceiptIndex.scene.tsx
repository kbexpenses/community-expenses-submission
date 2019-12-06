import React from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

type ReceiptReturn = {
  id: string;
  number: number;
  amount_cents: number;
  paper_copy_received: boolean;
  has_been_paid: boolean;
};

const ReceiptIndexQuery = gql`
  query ReceiptIndexQuery($user_id: String!) {
    receipts(where: { user_id: { _eq: $user_id } }) {
      id
      number
      amount_cents
      paper_copy_received
      has_been_paid
    }
  }
`;

const ReceiptIndex = () => {
  const { loading, error, data } = useQuery(ReceiptIndexQuery, {
    variables: {
      user_id: localStorage.getItem("_userId")
    }
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
        <p>Error #iY20Jq: {error.message}</p>
      </div>
    );
  }

  const { receipts } = data;

  return (
    <div>
      <h2>Receipts</h2>
      <ul>
        {receipts.map((receipt: ReceiptReturn) => {
          return (
            <li key={receipt.id}>
              Number: {receipt.number}; Amount: €
              {(receipt.amount_cents / 100).toFixed(2)}; Paper received:{" "}
              {receipt.paper_copy_received ? "Yes" : "No"}; Payment status:{" "}
              {receipt.has_been_paid ? "Sent" : "Pending"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReceiptIndex;
