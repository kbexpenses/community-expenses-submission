import React from "react";
import gql from "graphql-tag";
import { buildASTSchema } from "graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLBridge } from "uniforms-bridge-graphql";
import { AutoForm } from "uniforms-material";

// This tracks what is entered in the form
type ReceiptModel = {
  file_url: string;
  amount: string;
  date: string;
  includes_personal_info: boolean;
};

const formSchema = gql`
  type Receipt {
    file_url: String
    amount: String
    date: String
    includes_personal_info: Boolean
  }
`;
const formSchemaType = buildASTSchema(formSchema).getType("Receipt");
const formSchemaValidator = (model: ReceiptModel) => {
  const details = [];
  if (!model.file_url) {
    details.push({ name: "file_url", message: "A file is required" });
  }
  if (details.length) {
    throw details;
  }
};

const bridge = new GraphQLBridge(formSchemaType, formSchemaValidator);

const NewReceiptQuery = gql`
  query NewReceiptQuery {
    budget_categories {
      id
      name
    }
  }
`;

const NewReceiptMutation = gql`
  mutation NewReceiptMutation($object: receipts_insert_input!) {
    insert_receipts(objects: [$object]) {
      affected_rows
      returning {
        id
        user_id
      }
    }
  }
`;

const ReceiptNew = () => {
  const { loading, error, data } = useQuery(NewReceiptQuery);
  const [insertReceipt] = useMutation(NewReceiptMutation);

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
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const { budget_categories } = data;

  return (
    <div>
      <h1>Enter new receipt</h1>
      <ul>
        {budget_categories.map((cat: { id: string; name: string }) => {
          return <li key={cat.id}>{cat.name}</li>;
        })}
      </ul>
      <AutoForm
        schema={bridge}
        onSubmit={(model: ReceiptModel) => {
          const { file_url, amount, date, includes_personal_info } = model;
          const amount_cents = Math.round(parseFloat(amount) * 100);

          insertReceipt({
            variables: {
              object: {
                user_id: localStorage.getItem("_userId"),
                file_url,
                amount_cents,
                date,
                includes_personal_info: !!includes_personal_info
              }
            }
          });
        }}
      />
    </div>
  );
};

export default ReceiptNew;
