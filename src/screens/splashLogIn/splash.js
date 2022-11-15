import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, ScrollView, Modal, Pressable,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import SSOLogin from '../ssoLogin';

function Splash({ navigation }) {
  const [themeFontLoad] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Medium.ttf'),
  });

  if (!themeFontLoad) {
    // (deprecated) prevent app from displaying without the theme font loaded in
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="pizza" color="#02604E" size={100} />
        <Text style={styles.logo1}> Welcome To </Text>
        <Text style={styles.logo2}> Dartmart</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.modalContainer}>

          <View style={styles.authenticateSection}>
            <TouchableOpacity style={styles.ssoButton} onPress={() => navigation.navigate('SSOLogin')}>
              <Ionicons name="arrow-forward" color="whitesmoke" size={80} />
              <Text style={styles.text1}>SSO Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBDDBB',
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo1: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#02604E',
    marginTop: 30,
    marginBottom: 10,
  },
  logo2: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#02604E',

  },
  footer: {
    flex: 1,
    backgroundColor: '#02604E',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    color: 'whitesmoke',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins',
  },
  text2: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal',
  },
  authenticateSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ssoButton: {
    marginTop: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 12,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 33,
    borderColor: 'transparent',
    borderWidth: 2,
  },
});

export default Splash;
