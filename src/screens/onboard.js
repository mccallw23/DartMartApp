import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  StyleSheet, Text, View, TouchableHighlight, Dimensions, ScrollView, Modal, Pressable, Image, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { addItem, fetchItems } from '../actions/index';
import HomePage from './homePage';
import CategoryPage from './categoryPage';
import SSOLogin from './ssoLogin';
import Splash from './splashLogIn/splash';

const Stack = createStackNavigator();

function Onboard(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        tabBarStyle: {
          height: windowHeight * 0.1,
          borderTopRightRadius: windowHeight * 0.05,
          borderTopLeftRadius: windowHeight * 0.05,
          backgroundColor: '#008F74',
          position: 'absolute',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        headerStyle: {
          backgroundColor: '#BBDDBB',
          height: windowHeight * 0.15,
        },
        gestureEnabled: false,
        headerTitleAlign: 'left',
        headerTitle: 'Howdy!',
        headerTitleStyle: {
          marginLeft: 30,
          fontSize: 30,
          fontWeight: 'bold',
          color: '#02604E',
          // fontFamily: 'Poppins',
        },
      }}
    >
      <Stack.Screen name="Splash" component={Splash} options={{ headerLeft: () => null }} />
      <Stack.Screen name="SSOLogin" component={SSOLogin} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Onboard;
