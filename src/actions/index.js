import * as db from '../services/datastore';

// keys for actiontypes
export const ActionTypes = {
  // CART MANAGEMENT
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  // USER MANAGEMENT
  CREATE_USER: 'CREATE_USER',
  FETCH_USER: 'FETCH_USER',
  UPDATE_USER: 'UPDATE_USER',
  // ORDER MANAGEMENT
  FETCH_ORDER: 'FETCH_ORDER',
  SUBMIT_ORDER: 'SUBMIT_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  FETCH_ORDERS: 'FETCH_ORDERS',
  // INVENTORY MANAGEMENT
  FETCH_ITEMS: 'FETCH_ITEMS',
  FETCH_ITEM: 'FETCH_ITEM',
  // FOR WHAT CATEGORY TO DISPLAY
  SET_CATEGORY: 'SET_CATEGORY',
  // CARTPAGE UPDATE
  INCREMENT_QUANTITY: 'INCREMENT_QUANTITY',
  DECREMENT_QUANTITY: 'DECREMENT_QUANTITY',

  FETCH_CUSTOMER_ORDER: 'FETCH_CUSTOMER_ORDER',

  // PAYMENT SUCCESS UPDATE
  CONFIRM_PAYMENT: 'CONFIRM_PAYMENT',
};

// CART MANAGEMENT

export function addItem(item, quantity) { // edit the quantity of an item in the cart (if the item is new, adds to cart list)
  return {
    type: ActionTypes.ADD_ITEM,
    payload: { item, quantity },
  };
}

export function removeItem(item) {
  return {
    type: ActionTypes.REMOVE_ITEM,
    payload: { item },
  };
}

export function setCategory(category) {
  return {
    type: ActionTypes.SET_CATEGORY,
    payload: { category },
  };
}

// USER MANAGEMENT

export function createUser(newUserId, userfields) {
  return (dispatch) => {
    db.createUser(newUserId, userfields).then((response) => {
      dispatch({ type: ActionTypes.FETCH_USER, payload: response });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function fetchUser(username, pass) {
  return {
    type: ActionTypes.FETCH_USER,
    payload: { username, pass },
  };
}

export function updateUser(userId, updates) {
  return (dispatch) => {
    db.updateUser(userId, updates).then((response) => {
      dispatch({ type: ActionTypes.UPDATE_USER, payload: response });
    }).catch((error) => {
      console.log(error);
    });
  };
}

// ORDER MANAGEMENT

export function submitOrder(orderDetails) {
  return (dispatch) => {
    db.submitOrder(orderDetails).then((response) => {
      dispatch({ type: ActionTypes.SUBMIT_ORDER, payload: response });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function fetchOrder(orderId) {
  return {
    type: ActionTypes.FETCH_ORDER,
    payload: orderId,
  };
}

export function fetchOrders() {
  return (dispatch) => {
    db.fetchAllOrders().then((response) => {
      dispatch({ type: ActionTypes.FETCH_ORDERS, payload: response });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function updateOrder(orderId, updates) {
  return (dispatch) => {
    db.updateOrder(orderId, updates).then((response) => {
      dispatch({ type: ActionTypes.UPDATE_ORDER, payload: response });
    }).catch((error) => {
      console.log(error);
    });
  };
}

// INVENTORY ACCESS

export function fetchItems() {
  return (dispatch) => {
    db.fetchItems().then((response) => {
      dispatch({ type: ActionTypes.FETCH_ITEMS, payload: response });
    }).catch((error) => {
      console.log(error);
    });
  };
  // return {
  //   type: ActionTypes.FETCH_ITEMS,
  //   payload: {}
  // }
}
export function fetchCustomerOrder() {
  return (dispatch) => {
    db.fetchCustomerOrder().then((response) => {
      dispatch({ type: ActionTypes.FETCH_CUSTOMER_ORDER, payload: response });
    }).catch((error) => {
      console.log(error);
    });
  };
}

// CARTPAGE QUANTITY CONTROL FOR EACH ITEM
export function increment() {
  return {
    type: ActionTypes.INCREMENT,
    payload: null,
  };
}

export function decrement() {
  return {
    type: ActionTypes.DECREMENT,
    payload: null,
  };
}

// PAYMENT SUCCESS UPDATE
export function confirmPayment() {
  return {
    type: ActionTypes.CONFIRM_PAYMENT,
    payload: true,
  };
}
