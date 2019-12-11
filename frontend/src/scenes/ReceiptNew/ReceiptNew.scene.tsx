import React from "react";
import gql from "graphql-tag";
import { buildASTSchema } from "graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLBridge } from "uniforms-bridge-graphql";
import { AutoForm, AutoField, NumField } from "uniforms-material";
import Button from "@material-ui/core/Button";

import { getUserId } from "../../services/auth/auth.service";
import ErrorsField from "../../components/ErrorsField.component";

// This tracks what is entered in the form
type ReceiptModel = {
  file_url: string;
  amount: string;
  date: string;
  includes_personal_info: boolean;
  pay_to_name: string;
  pay_to_iban: string;
  pay_to_notes: string;
};

const formSchema = gql`
  type Receipt {
    file_url: String
    amount: String
    date: String
    includes_personal_info: Boolean
    pay_to_name: String
    pay_to_iban: String
    pay_to_notes: String
  }
`;
const formSchemaType = buildASTSchema(formSchema).getType("Receipt");
const formSchemaValidator = (model: ReceiptModel) => {
  const details = [];
  if (!model.file_url) {
    details.push({ name: "file_url", message: "A file is required" });
  }
  if (!model.amount) {
    details.push({
      name: "amount",
      message: "Please specify the amount of this receipt"
    });
  }
  if (!model.date) {
    details.push({
      name: "date",
      message: "Please enter the date on the receipt"
    });
  }
  if (!model.pay_to_iban && !model.pay_to_notes) {
    details.push({
      name: "pay_to_iban",
      message:
        "Please enter the IBAN of where we should pay, or specify a note instead."
    });
  }
  if (details.length) {
    // eslint-disable-next-line no-throw-literal
    throw { details };
  }
};
const formSchemaExtras = {
  date: {
    type: "Date"
  },
  amount: {
    label: "Amount of this receipt in EUR"
  }
};

const bridge = new GraphQLBridge(
  formSchemaType,
  formSchemaValidator,
  formSchemaExtras
);

const NewReceiptQuery = gql`
  query NewReceiptQuery($user_id: String!) {
    budget_categories {
      id
      name
    }
    user_profiles(where: { user_id: { _eq: $user_id } }) {
      name
      iban
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
  const { loading, error, data } = useQuery<
    {
      budget_categories: { id: string; name: string }[];
      user_profiles: { name: string; iban: string }[];
    },
    { user_id?: string | null }
  >(NewReceiptQuery, {
    variables: {
      user_id: getUserId()
    }
  });
  const [insertReceipt] = useMutation(NewReceiptMutation);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
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
  const { iban: pay_to_iban, name: pay_to_name } = data.user_profiles[0] || {};

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
        model={{ includes_personal_info: true, pay_to_iban, pay_to_name }}
        onSubmit={async (model: ReceiptModel) => {
          const { amount, includes_personal_info, ...object } = model;
          const amount_cents = Math.round(parseFloat(amount) * 100);

          // const allocations: any[] = [];

          try {
            await insertReceipt({
              variables: {
                object: {
                  ...object,
                  user_id: getUserId(),
                  amount_cents,
                  includes_personal_info: !!includes_personal_info
                  // budget_allocations: {
                  //   data: allocations
                  // }
                }
              }
            });
          } catch (error) {
            alert(`Submission failed #vuaiAI. ${error.message}`);
          }

          alert("Submission success");
        }}
      >
        <AutoField name="file_url" />
        <NumField decimal name="amount" />
        <AutoField name="date" />
        <h3>Payment</h3>
        <p>Input the details of how this invoice should be paid.</p>
        <AutoField name="pay_to_name" />
        <AutoField name="pay_to_iban" />
        <AutoField name="pay_to_notes" />
        <h3>Personal information</h3>
        <p>
          If this receipt does not contain the name and address of any
          individual person, then please uncheck the box below. If you do, the
          full contents of the receipt will be <strong>publicly visible</strong>
          .
        </p>
        <AutoField name="includes_personal_info" />
        <ErrorsField />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </AutoForm>
    </div>
  );
};

export default ReceiptNew;
