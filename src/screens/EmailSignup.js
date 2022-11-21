import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { async } from "@firebase/util";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { LoginUser } from "../services/datastore.js";

import firebase from "../services/datastore.js";
import { connect } from "react-redux";
import { createUser } from "../actions/index";

const EmailSignUp = (props) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  let createUser = async (
    email,
    password,
    firstName,
    lastName,
  ) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: "https://www.dartdashed.com",
          })
          .then(() => {
            alert("Verification email sent");
          })
          .catch((error) => {
            alert(error);
          })
          .then(() => {
            props.createUser(firebase.auth().currentUser.uid, {
              email: email,
              name: firstName + " " + lastName,
              isDriver: false,
              isDriverAuthorized: false,
            });
            props.navigation.navigate("EmailLogin");
          })
          .catch((error) => {
            alert(error);
          });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage, errorCode);
        });
    };

        


    //     .then((userCredential) => {
    //         alert("Verification Email Sent");
    //         firebase.auth().currentUser.sendEmailVerification({
    //           handleCodeInApp: true,
    //           url: "dartmart-20a22.firebaseapp.com",
    //         }).catch((error) => {
    //             var errorCode = error.code;
    //             var errorMessage = error.message;
    //             alert( "auth for email didnt work,", errorMessage, errorCode);
    //             }
    //         );
    //     }).then((userCredential) => {
    //         alert("Account Created");
    //         props.createUser(userCredential.user.uid, {
    //             email: email,
    //             name: firstName + " " + lastName,
    //             isDriver: false,
    //             isDriverAuthorized: false,
    //         });
    //         props.navigation.navigate("Main");
    //     })
    //     .catch((error) => {
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         alert(errorMessage, errorCode);
    //     });
    // };
        // firebase.auth().currentUser.updateProfile({
        // displayName: firstName + " " + lastName,
        // }))
        // .then((userCredential) => {
        // var user = userCredential.user;
        // alert("Account Created");
        // props.navigation.navigate("EmailLogin");
        // })
        // .catch((error) => {
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // alert(errorMessage, errorCode);
        // });


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Email Sign-Up</Text>
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
        <TextInput
          style={styles.textinput}
          placeholder='First Name'
          onChangeText={(firstName) => setFirstName(firstName)}
          autoCapitalize='none'
        />
        <TextInput
          style={styles.textinput}
          placeholder='Last Name'
          onChangeText={(lastName) => setLastName(lastName)}
          autoCapitalize='none'
        />
        <TouchableOpacity
          onPress={() => createUser(email, password, firstName, lastName)}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonFooter}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("EmailLogin")}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
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
    backgroundColor: "grey",
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
    fontSize: 30,
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

export default connect(null, { createUser })(EmailSignUp);
