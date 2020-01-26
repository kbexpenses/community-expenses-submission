import React from "react";
import gql from "graphql-tag";
import { buildASTSchema } from "graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLBridge } from "uniforms-bridge-graphql";
import { AutoForm } from "uniforms-material";

import { getUserId } from "../../services/auth/auth.service";

type ProfileModel = {
  name: string;
  iban: string;
  email: string;
  phone_number: string;
};

const formSchema = gql`
  type Profile {
    name: String
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
    // eslint-disable-next-line no-throw-literal
    throw { details };
  }
};

const bridge = new GraphQLBridge(formSchemaType, formSchemaValidator);

export const ProfileQuery = gql`
  query Profile {
    user_profiles {
      id
      name
      iban
      email
      phone_number
    }
  }
`;

const SetProfileMutation = gql`
  mutation SetProfile($object: user_profiles_insert_input!) {
    insert_user_profiles(
      objects: [$object]
      on_conflict: {
        constraint: user_profiles_user_id_key
        update_columns: [name, email, phone_number, iban]
      }
    ) {
      affected_rows
      returning {
        id
        user_id
        name
        email
        phone_number
        iban
      }
    }
  }
`;

const Profile : React.FC<{promptUser: boolean, onSubmit: Function}> = props => {
  const { loading, error, data } = useQuery(ProfileQuery);
  const [setProfile] = useMutation(SetProfileMutation);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
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

  const [profile] = data.user_profiles;

  const userPrompt = <div>Please create a user profile in order to add receipts</div>

  return (
    <div>
      {props.promptUser && userPrompt}
      <h1>Profile</h1>
      <AutoForm
        schema={bridge}
        model={profile}
        onSubmit={async (
          model: ProfileModel & { __typename: string; id: string }
        ) => {
          const { __typename, id, ...object } = model;
          try {
            await setProfile({
              variables: {
                object: {
                  ...object,
                  user_id: getUserId()
                }
              }
            });
            alert("Profile successfully updated.");
            props.onSubmit();
          } catch (error) {
            alert(`Error #NL7KW3: ${error.message}`);
          }
        }}
      />
    </div>
  );
};

export default Profile;
