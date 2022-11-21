import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Modal, Pressable } from 'react-native'
import React, { useState, useEffect } from "react";
import {useNavigation} from '@react-navigation/native';
import { async } from '@firebase/util';
import EmailSignup from './EmailSignup.js';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { LoginUser } from '../services/datastore.js';

import firebase from '../services/datastore.js';
import { connect } from 'react-redux';
import { createUser } from "../actions/index";
import { Ionicons } from "@expo/vector-icons";


const EmailLogin = (props) => {


const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  let loginUser = async (email, password) => {
    
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
      var user = userCredential.user;
      props.createUser(user.uid, {email: email, name: user.displayName, isDriver: false, isDriverAuthorized: false});
      if (user.emailVerified) {
        alert("Login successful");
        props.navigation.navigate("Main");
      }
      else {
        alert("Please verify your email");
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage, errorCode);
    })
  }

  // export async function createUser(newUserId, data) {
  //   const response = await fetchUser(data.email);
  //   if (response.docs.length > 0) {
  //     console.log("user found", response.docs[0].data());
  //     return { ...response.docs[0].data(), id: response.docs[0].id };
  //   } else {
  //     console.log("pulling customer");
  //     const customer = await axios.post(
  //       `${LIVE_STRIPE_SERVER}${ROUTE_CUSTOMERS}`,
  //       {
  //         email: data.email,
  //         name: data.name,
  //         isDriverAuthorized: false,
  //       },
  //     );
  //     console.log("customer found:", customer.data);
  //     const tempDoc = await setDoc(doc(db, "users", newUserId), {
  //       ...data,
  //       id: newUserId,
  //       stripeId: customer.data.id,
  //     });
  //     // console.log('created user:', tempDoc);
  //     return tempDoc;
  //     // return null
  //   }
  // }


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Email Sign-In</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textinput}
          placeholder='Email'
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
        />
        <TextInput
          style={styles.textinput}
          placeholder='Password'
          onChangeText={(password) => setPassword(password)}
          autoCapitalize='none'
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => loginUser(email, password)}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Login</Text>
          <Ionicons name='ios-arrow-forward' size={40} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonFooter}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("EmailSignUp")}
        >

          <Text style={styles.loginText}>... Or Sign Up</Text>
          <Ionicons name='ios-arrow-forward' size={40} color='white' />
        </TouchableOpacity>
      </View>
    </View>
  );

};



const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "rgb(194,219,190)",
  },
  inputView: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 100,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    color: "white",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    color: "white",
  },
  textinput: {
    backgroundColor: "white",
    marginBottom: 10,
    marginTop: 20,
    color: "black",
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loginButton: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "grey"
  },
  button: {
    marginTop: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    opacity: 12,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 33,
    borderColor: "transparent",
    borderWidth: 2,
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30
  },
  buttonFooter: {
    flex: 1,
    backgroundColor: "#02604E",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
});

  export default connect(null, {createUser})(EmailLogin);
