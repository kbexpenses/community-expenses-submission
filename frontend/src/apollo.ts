import ApolloClient from "apollo-boost";

const uri =
  process.env.REACT_APP_GRAPHQL_URL || "http://localhost:4000/graphql";

const client = new ApolloClient({
  uri
});

export default client;
