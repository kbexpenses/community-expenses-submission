import Auth0Lock from "auth0-lock";

import store from "../../store";
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
const startup = () => {
  const userId = getUserId();
  const roles = getRoles();
  if (!!userId && !!roles && roles.length > 0)
    store.dispatch(loginSuccessful(userId, roles));
};
startup();
