import React from "react";
import gql from "graphql-tag";
import { buildASTSchema } from "graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLBridge } from "uniforms-bridge-graphql";
import { AutoForm } from "uniforms-material";

type ProfileModel = {
  iban: string;
  email: string;
  phone_number: string;
};

const formSchema = gql`
  type Profile {
    iban: String
    email: String
    phone_number: String
  }
`;

const formSchemaType = buildASTSchema(formSchema).getType("Profile");
const formSchemaValidator = (model: ProfileModel) => {
  const details = [];
  if (!model.iban) {
    details.push({ name: "iban", message: "IBAN is required" });
  }
  if (details.length) {
    throw details;
  }
};

const bridge = new GraphQLBridge(formSchemaType, formSchemaValidator);

const ProfileQuery = gql`
  query Profile {
    user_profiles {
      id
      iban
      email
      phone_number
    }
  }
`;

const SetProfileMutation = gql`
  mutation SetProfile(
    $user_id: String!
    $email: String!
    $phone_number: String!
    $iban: String!
  ) {
    insert_user_profiles(
      objects: {
        email: $email
        phone_number: $phone_number
        iban: $iban
        user_id: $user_id
      }
      on_conflict: {
        constraint: user_profiles_user_id_key
        update_columns: [email, phone_number, iban]
      }
    ) {
      affected_rows
      returning {
        id
        user_id
        email
        phone_number
        iban
      }
    }
  }
`;

const Profile = () => {
  const { loading, error, data } = useQuery(ProfileQuery);
  const [setProfile] = useMutation(SetProfileMutation);

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

  const [profile] = data.user_profiles;

  return (
    <div>
      <h1>Profile</h1>
      <AutoForm
        schema={bridge}
        model={profile}
        onSubmit={(model: ProfileModel) => {
          const { iban, phone_number, email } = model;
          setProfile({
            variables: {
              user_id: localStorage.getItem("_userId"),
              iban,
              phone_number,
              email
            }
          });
        }}
      />
    </div>
  );
};

export default Profile;
