import { ActionTypes } from '../actions';

const initialState = {
  user: {},
};

const UserReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER:
      return { ...state, user: action.payload };
    case ActionTypes.UPDATE_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default UserReducer;
