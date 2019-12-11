import { Action } from "redux";

const LOGIN_SUCCESSFUL = "app/auth/SUCCESSFUL_LOGIN";
interface LoginSuccessfulAction extends Action<typeof LOGIN_SUCCESSFUL> {
  payload: {
    userId: string;
    roles: string[];
  };
}
export const loginSuccessful = (
  userId: string,
  roles: string[]
): LoginSuccessfulAction => {
  return {
    type: LOGIN_SUCCESSFUL,
    payload: {
      userId,
      roles
    }
  };
};

type State = {
  isLoggedIn: boolean;
  userId?: string;
  roles: string[];
};
const empty = {
  isLoggedIn: false,
  roles: []
};

type AuthActions = LoginSuccessfulAction;

const reducer = (state: State = empty, action: AuthActions) => {
  switch (action.type) {
    case LOGIN_SUCCESSFUL: {
      return {
        ...state,
        userId: action.payload.userId,
        roles: action.payload.roles
      };
    }
  }

  return state;
};

export default reducer;
