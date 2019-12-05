import { Action } from "redux";

const empty = {
  nothing: null
};

const reducer = (state = empty, action: Action) => state;

export default reducer;
