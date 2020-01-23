import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { buildASTSchema } from "graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLBridge } from "uniforms-bridge-graphql";
import axios from "axios";
import dayjs from "dayjs";
import {
  AutoForm,
  AutoField,
  NumField,
  ListField,
  NestField,
  SelectField,
  ListDelField
} from "uniforms-material";
import Button from "@material-ui/core/Button";

import { formSchemaValidator } from "./ReceiptNew.helpers";
import { getUserId, getToken } from "../../services/auth/auth.service";
import ErrorsField from "../../components/ErrorsField.component";
import AuthImage from "../../components/AuthImage";
import { useHistory } from "react-router-dom";
import { withStyles, Theme, createStyles, WithStyles } from "@material-ui/core";

// This tracks what is entered in the form
export type ReceiptModel = {
  amount: number;
  date: string;
  budget_allocations: {
    budget_category: string;
    amount: number;
  }[];
  includes_personal_info: boolean;
  pay_to_name: string;
  pay_to_iban: string;
  pay_to_notes: string;
};

const formSchema = gql`
  type ReceiptBudgetCategoryAllocation {
    budget_category: String
    amount: Float
  }
  type Receipt {
    amount: Float
    date: String
    budget_allocations: [ReceiptBudgetCategoryAllocation!]
    includes_personal_info: Boolean
    pay_to_name: String
    pay_to_iban: String
    pay_to_notes: String
  }
`;
const formSchemaType = buildASTSchema(formSchema).getType("Receipt");
const formSchemaExtras = {
  date: {
    type: "Date"
  },
  amount: {
    label: "Amount of this receipt in EUR"
  },
  pay_to_name: { label: "Repayment Name" },
  pay_to_iban: { label: "Repayment to IBAN" },
  pay_to_notes: {
    label: "Any extra information for repayment",
    multiline: true
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

const ReceiptNew: React.FC<Props> = props => {
  const { classes } = props;

  const [fileUrl, setFileUrl] = useState("");

  const history = useHistory();

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

  const { getRootProps, getInputProps } = useDropzone({
    accept: ["image/*"],
    multiple: false,
    onDropAccepted: files => {
      const data = new FormData();
      data.append("file", files[0]);
      axios
        .post("http://localhost:4000", data, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        .then(response => {
          setFileUrl(response.data.fileUrl);
        });
    }
  });

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
  const budget_categories_names = budget_categories.map(b => b.name);
  const { iban: pay_to_iban, name: pay_to_name } = data.user_profiles[0] || {};

  if (fileUrl === "") {
    return (
      <div className={classes.container}>
        <h1>Upload a file</h1>
        <p>
          To start submitting a new receipt, please upload a picture of the
          receipt.
        </p>
        <p>
          A photo or a scan (as an image) will work great. Unfortunately{" "}
          <strong>PDFs are not supported</strong> (yet), only images.
        </p>
        <div {...getRootProps()} className={classes.uploader}>
          <input {...getInputProps()} />
          <p>Drag and drop a file here, or click to select a file.</p>
          <Button variant="contained">Select a file</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <h1>Enter receipt info</h1>
      <AuthImage file_url={fileUrl} />
      <AutoForm
        schema={bridge}
        model={{
          date: dayjs().format("YYYY-MM-DD"),
          includes_personal_info: true,
          pay_to_iban,
          pay_to_name
        }}
        onSubmit={async (model: ReceiptModel) => {
          const { amount, includes_personal_info, ...object } = model;
          const amount_cents = Math.round(amount * 100);

          const budget_allocations = model.budget_allocations.map(
            budget_allocation => {
              const budget_category = budget_categories.find(
                b => b.name === budget_allocation.budget_category
              );
              if (!budget_category) {
                throw new Error("Unable to find budget category ID. #9gNLUG");
              }

              // If there is only a single budget category, and it does not have
              // an amount, then copy the amount from the receipt, assuming the
              // entire value is assigned to this category.
              const allocation_amount_cents =
                model.budget_allocations.length === 1 &&
                !budget_allocation.amount
                  ? amount_cents
                  : Math.round(budget_allocation.amount * 100);

              return {
                budget_category_id: budget_category.id,
                amount_cents: allocation_amount_cents
              };
            }
          );

          try {
            const response = await insertReceipt({
              variables: {
                object: {
                  ...object,
                  file_url: fileUrl,
                  user_id: getUserId(),
                  amount_cents,
                  includes_personal_info: !!includes_personal_info,
                  budget_allocations: {
                    data: budget_allocations
                  }
                }
              }
            });
            alert("Submission success");
            const receiptId = response.data.insert_receipts.returning[0].id;
            history.push(`/receipts/${receiptId}`);
          } catch (error) {
            alert(`Submission failed #vuaiAI. ${error.message}`);
          }
        }}
      >
        <h3>Details</h3>
        <NumField decimal name="amount" />
        <AutoField name="date" />

        <h3>Payment</h3>
        <p>Input the details of how this invoice should be paid.</p>
        <AutoField name="pay_to_name" />
        <AutoField name="pay_to_iban" />
        <AutoField name="pay_to_notes" />

        <h3>Categories</h3>
        <p>Which project category is this receipt being charged to?</p>
        <ListField name="budget_allocations" initialCount={1} label={false}>
          <NestField name="$">
            <SelectField
              name="budget_category"
              label="Budget category"
              allowedValues={budget_categories_names}
            />
            <AutoField
              name="amount"
              label="Amount in EUR (or leave blank if only 1 category)"
            />
            <ListDelField name="" />
          </NestField>
        </ListField>

        <h3>Personal information</h3>
        <p>
          If this receipt does not contain the name and address of any
          individual person, then please uncheck the box below. If you do, the
          full contents of the receipt will be <strong>publicly visible</strong>
          .
        </p>
        <AutoField name="includes_personal_info" />
        <ErrorsField />

        <p>
          When you're happy with the data you've entered, submit this receipt.
          There is no undo, so please double check the details above.
        </p>
        <div className={classes.submitWrapper}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            className={classes.submit}
          >
            Submit
          </Button>
        </div>
      </AutoForm>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      maxWidth: "450px",
      paddingBottom: "80px",
      marginLeft: "auto",
      marginRight: "auto"
    },
    title: {
      flexGrow: 1
    },
    submit: {
      marginTop: "20px"
    },
    submitWrapper: {
      textAlign: "center"
    },
    uploader: {
      width: "90%",
      marginTop: "30px",
      marginLeft: "auto",
      marginRight: "auto",
      borderColor: "lightblue",
      borderWidth: "12px",
      borderStyle: "dotted",
      padding: "60px 20px",
      textAlign: "center"
    }
  });

type Props = WithStyles<typeof styles>;

export default withStyles(styles)(ReceiptNew);
