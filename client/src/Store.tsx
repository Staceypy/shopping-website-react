import { createStore } from "redux";
import { Customer } from "./types";

type CustomerAction =
  | { type: "SET_CUSTOMER"; payload: Customer }
  | { type: "CLEAR_CUSTOMER"; payload?: null };

export type State = {
  customer: Customer | null;
};

const initialState: State = {
  customer: null,
};

const customerReducer = (
  state: State = initialState,
  action: CustomerAction
): State => {
  console.log('Action:', action.type, 'Payload:', action.payload);
  switch (action.type) {
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload };
    case "CLEAR_CUSTOMER":
      return { ...state, customer: null };
    default:
      return state;
  }
};

const store = createStore(customerReducer);

export default store;
