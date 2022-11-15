import { ActionTypes } from '../actions';

const initialState = {
  cart: [],
  allItems: [],
  category: '',
};

const ItemReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.FETCH_ITEMS:
      return { ...state, allItems: action.payload };
    case ActionTypes.ADD_ITEM:
      var newList = state.cart.map((value) => ({ ...value }));
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].item.name === action.payload.item.name) {
          newList[i].quantity += action.payload.quantity;
          return { ...state, cart: newList };
        }
      }
      return { ...state, cart: [...newList, action.payload] };
    case ActionTypes.REMOVE_ITEM:
      var newList = state.cart.map((value) => ({ ...value }));
      var index = -1;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].item.name === action.payload.item.name) {
          index = i;
          break;
        }
      }
      if (index != -1) newList.splice(index, 1);
      return { ...state, cart: newList };
    case ActionTypes.SET_CATEGORY:
      return { ...state, category: action.payload.category };
    default:
      return state;
  }
};

export default ItemReducer;
