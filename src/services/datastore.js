import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  getFirestore,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  SERVER_URL_HEROKU,
  ROUTE_CUSTOMERS,
  LIVE_STRIPE_SERVER,
} from "../Constants";
//import Stripe from "stripe";
//import 'dotenv/config';

// FIREBASE CONFIGURATION

// firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBztmmLcSw6qyEq8SWpImxAjbJSXiZURN0",
  authDomain: "dartmart-20a22.firebaseapp.com",
  projectId: "dartmart-20a22",
  storageBucket: "dartmart-20a22.appspot.com",
  messagingSenderId: "523739133844",
  appId: "1:523739133844:web:6d12f59d68c1c280070181",
  measurementId: "G-BEH6MVE7K5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const SECRET_KEY = process.env.SECRET_KEY;
// const stripe = new Stripe(SECRET_KEY, { apiVersion: '2020-08-27' });

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// INVENTORY FUNCTIONS

// check if a user with a given email address already exists
// initialize a user in the database

// Fetch all items for displaying product options in menu
export async function fetchItems() {
  const querySnapshot = await getDocs(collection(db, "items"));
  return querySnapshot.docs.map((doc) => doc.data());
  // querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     // console.log(doc.id, " => ", doc.data());
  // });
}

// Decrement the quantity of an item in the inventory (for when an item is ordered)
export async function updateItemQuantity(itemId, quantityChange) {
  // fetch the data for the item being ordered
  const docRef = doc(db, "items", itemId);
  const docSnap = await getDoc(docRef);

  // if the item is found in the inventory, update quantity
  if (docSnap.exists()) {
    // fetch previous quantity
    const prevQuantity = docSnap.quantity;
    // calculate new quantity based on order information
    const newQuantity = prevQuantity - quantityChange;
    // update the quantity stored in the database
    await updateDoc(docRef, {
      quantity: newQuantity,
    });
    // if the item is not found, console log that the item was not found
  } else {
    console.log("Item not found during getDoc");
  }
}

// USER FUNCTIONS

// check if a user with a given email address already exists
export async function fetchUser(email) {
  const usersRef = collection(db, "users");
  const userExistsQuery = query(usersRef, where("email", "==", email));
  return getDocs(userExistsQuery);
}

// initialize a user in the database
export async function createUser(newUserId, data) {
  const response = await fetchUser(data.email);
  if (response.docs.length > 0) {
    console.log("user found", response.docs[0].data());
    return { ...response.docs[0].data(), id: response.docs[0].id };
  } else {
    console.log("pulling customer");
    const customer = await axios.post(
      `${LIVE_STRIPE_SERVER}${ROUTE_CUSTOMERS}`,
      {
        email: data.email,
        name: data.name,
        isDriverAuthorized: false,
      }
    );
    console.log("customer found:", customer.data);
    const tempDoc = await setDoc(doc(db, "users", newUserId), {
      ...data,
      id: newUserId,
      stripeId: customer.data.id,
    });
    // console.log('created user:', tempDoc);
    return tempDoc;
    // return null
  }
}

// initialize a user in the databse
//export async function createUser(newUserId, data) {

// const response = await fetchUser(data.email);
//   console.log('fetchingUser', response.docs);
// if (response.docs.length > 0){
//   console.log("user found", response.docs[0].data());
//   return response.docs[0].data();
// } else {
//   const customer = await stripe.customers.create({
//     email: data.email
//   });
//   const doc = await setDoc(doc(db, "users", newUserId), {...data, stripId: customer.id});
//   console.log('created user:', doc);
//   return doc;
// }

// if (!querySnapshot.exists()){
//   const customer = await stripe.customers.create({
//     email: data.email
//   });
//   newData = {...data, customerId: customer.id};
//   const doc = await setDoc(doc(db, "users", newUserId), newData);
//   console.log("doc", doc);
//   return doc;

// }

// return querySnapshot.data();

//   export async function createUser(newUserId, data) {
//   fetchUser(data.email).then((response) => {
//     console.log('fetchingUser', response.docs);
//   if (response.docs.length > 0){
//     console.log('existing user found!');
//   } else {
//     setDoc(doc(db, "users", newUserId), data);
//   }
// })
// }
//}

// update information about a user in the database
export async function updateUser(userId, data) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, data);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

// FUNCTIONS FOR ORDERS

// initialize an order in the database
export async function submitOrder(data) {
  const docRef = await addDoc(collection(db, "orders"), { ...data });
  const snap = await getDoc(docRef);
  return { ...snap.data(), id: snap.id };
}

export async function fetchOrder(orderId, callback) {
  const docRef = doc(db, "items", orderId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    callback(docSnap.data());
  } else {
    console.log("Order not found during fetchOrder");
  }
}

// update the status of an order as it is being submitted and fulfilled
export async function updateOrder(orderId, data) {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, data);
  const docSnap = await getDoc(docRef);
  return { ...docSnap.data(), id: docSnap.id };
}

// Fetch all orders in the database
// Returns a promise; data can be accessed w/ querySnapshot.docs.map(doc => doc.data())
export async function fetchAllOrders() {
  const res = await getDocs(collection(db, "orders"));
  return res.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
}

// Fetch all orders in progress
// Returns a promise; data can be accessed w/ querySnapshot.docs.map(doc => doc.data())
export async function fetchInProgressOrders() {
  const inProgressOrderQuery = query(
    collection(db, "orders"),
    where("status", "==", "in-progress")
  );
  return getDocs(inProgressOrderQuery);
}

// Fetch all orders for a certain deliverer
// Returns a promise; data can be accessed w/ querySnapshot.docs.map(doc => doc.data())
export async function fetchDeliveryOrders(deliveryID) {
  deliveryOrderQuery = query(
    collection(db, "orders"),
    where("deliverId", "==", deliveryID)
  );
  return getDocs(deliveryOrderQuery);
}

// Fetch all orders for a certain customer
// Returns a promise; data can be accessed w/ querySnapshot.docs.map(doc => doc.data())
// export async function fetchOrders(customer) {
//   customerOrderQuery = query(collection(db, "orders"), where ('customerId', '==', customer));
//   return getDocs(customerOrderQuery);
// }

export async function fetchOrders(customerId) {
  const ordersRef = collection(db, "orders");
  const orderExistsQuery = query(
    ordersRef,
    where("customerId", "==", customerId),
    where("status", "==", "in-progress")
  );
  const orders = getDocs(orderExistsQuery);
  if (orders.docs.length > 0) {
    return { ...orders.docs[0].data(), id: orders.docs[0].id };
  } else {
    return null;
  }
}
