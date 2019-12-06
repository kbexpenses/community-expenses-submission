import React from "react";
import gql from "graphql-tag";
import { buildASTSchema } from "graphql";
import { useQuery } from "@apollo/react-hooks";
import { GraphQLBridge } from "uniforms-bridge-graphql";
import { AutoForm } from "uniforms-material";

type ProfileModel = {
  iban: string;
  email: string;
  phoneNumber: string;
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

const Profile = () => {
  const { loading, error, data } = useQuery(ProfileQuery);
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
        onSubmit={(data: ProfileModel) => {
          debugger;
        }}
      />
    </div>
  );
};

export default Profile;
