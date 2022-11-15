import { ActionTypes } from '../actions';

const initialState = {
  paymentConfirmed: false,
};

const PaymentReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.CONFIRM_PAYMENT:
      return { paymentConfirmed: action.payload };
    default:
      return state;
  }
};

export default PaymentReducer;
