import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBztmmLcSw6qyEq8SWpImxAjbJSXiZURN0",
  authDomain: "dartmart-20a22.firebaseapp.com",
  projectId: "dartmart-20a22",
  storageBucket: "dartmart-20a22.appspot.com",
  messagingSenderId: "523739133844",
  appId: "1:523739133844:web:6d12f59d68c1c280070181",
  measurementId: "G-BEH6MVE7K5",
};

let app;
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export { firebase };