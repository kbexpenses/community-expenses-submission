import ApolloClient, { Operation } from "apollo-boost";

import { getToken, userHasRole } from "./services/auth/auth.service";

const uri =
  process.env.REACT_APP_GRAPHQL_URL || "http://localhost:8080/v1/graphql";

const client = new ApolloClient({
  uri,
  request: (operation: Operation) => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-hasura-role": userHasRole("admin") ? "admin" : "user"
        // "x-hasura-admin-secret":
        //   "jwACehZsUDArTKlSTEnqOqbl5j42uGulK4gKpYJ2n2SW7Skn28QCvrxUrBhgcaz"
      }
    });
  }
});

export default client;
