import Auth0Lock from "auth0-lock";
import gql from "graphql-tag";

import store from "../../store";
import apollo from "../../apollo";
import { loginSuccessful, logoutActionCreator } from "./auth.state";

const TOKEN_STORAGE_KEY = "_authToken";
const USER_ID_STORAGE_KEY = "_userId";
const ROLES_STORAGE_KEY = "_roles";

const storage = window.sessionStorage;

const lock = new Auth0Lock(
  "mZeX1QFQKvmzwjZKYRcvmzYsO8d1Ygox",
  "community-expenses-dev.eu.auth0.com",
  {
    auth: {
      responseType: "token",
      redirect: false,
      redirectUrl: "http://localhost:3000"
    }
  }
);

/*
lock.on("authorization_error", error => {
  debugger;
});
lock.on("unrecoverable_error", error => {
  debugger;
});
*/

lock.on("authenticated", (authResult: AuthResult) => {
  const userId = authResult.idTokenPayload.sub;
  const roles = (authResult.idTokenPayload as any)[
    "https://hasura.io/jwt/claims"
  ]["x-hasura-allowed-roles"];

  storage.setItem(TOKEN_STORAGE_KEY, authResult.idToken);
  storage.setItem(USER_ID_STORAGE_KEY, userId);

  storage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));

  store.dispatch(loginSuccessful(userId, roles));
});

export const showLock = () => {
  lock.show();
};

export const logout = () => {
  storage.clear();
  store.dispatch(logoutActionCreator());
  lock.logout({ returnTo: "http://localhost:3000/" });
};

export const getToken = () => {
  return storage.getItem(TOKEN_STORAGE_KEY);
};

export const getUserId = () => {
  return storage.getItem(USER_ID_STORAGE_KEY);
};

export const getRoles = (): string[] => {
  return JSON.parse(storage.getItem(ROLES_STORAGE_KEY) || `["user"]`);
};

export const userHasRole = (role: string) => {
  const roles = getRoles();
  return roles.indexOf(role) !== -1;
};

// We need to re-read these from `storage` on startup to ensure that our redux
// store is kept up to date.
export const startup = () => {
  const userId = getUserId();
  const roles = getRoles();
  if (!!userId && !!roles && roles.length > 0) {
    // Try to make a GraphQL request to ensure that we have a valid JWT
    apollo
      .query({
        query: gql`
          query StartupProfile($user_id: String!) {
            user_profiles(where: { user_id: { _eq: $user_id } }) {
              id
            }
          }
        `,
        variables: {
          user_id: userId,
        },
      })
      .then((result) => {
        store.dispatch(loginSuccessful(userId, roles));
      })
      .catch((error) => {
        alert(`GraphQL Error #9yhFiw: ${error.message}`);
      });
  }
};

// We have a circular import here. The `apollo.ts` file imports this file, and
// this file imports `apollo` from `apollo.ts`. Therefore we need to trigger the
// `startup()` call in the next flush, hence the `setTimeout()` here.
setTimeout(startup, 0);
