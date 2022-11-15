import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  customerOrder: {},
};

const OrderReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.FETCH_CUSTOMER_ORDER:
      return { ...state, customerOrder: action.payload };
    case ActionTypes.FETCH_ORDERS:
      return { ...state, all: action.payload };
    case ActionTypes.SUBMIT_ORDER:
      return { ...state, all: [...state.all, action.payload] };
    case ActionTypes.UPDATE_ORDER:
      var newList = state.all.map((value) => ({ ...value }));
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].id === action.payload.id) {
          newList[i] = action.payload;
          break;
        }
      }
      return { ...state, all: newList };
    default:
      return state;
  }
};

export default OrderReducer;
