import { combineReducers } from '@reduxjs/toolkit';

import ItemReducer from './item-reducer';
import OrderReducer from './order-reducer';
import PaymentReducer from './payment-reducer';
import UserReducer from './user-reducer';

const rootReducer = combineReducers({
  item: ItemReducer,
  user: UserReducer,
  order: OrderReducer,
  payment: PaymentReducer,
});

export default rootReducer;
