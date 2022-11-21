import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import MainTabBar from './src/navigation/main_tab_bar';
import { LogBox } from "react-native";
import { Provider } from 'react-redux';
import {StripeProvider} from "@stripe/stripe-react-native";
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './src/reducers';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SSOLogin from './src/screens/ssoLogin';
import Onboard from './src/screens/onboard';
import SSOLogout from './src/screens/ssoLogout';
import EmailLogin from './src/screens/EmailLogin';
import { PUBLISHABLE_KEY_LIVE, PUBLISHABLE_KEY_TEST } from '@env';
import EmailSignup from './src/screens/EmailSignup';
import { firebase } from './config'; 



// disable really annoying in app warnings
LogBox.ignoreAllLogs();
const store = configureStore({
  reducer: rootReducer
})

const Stack = createStackNavigator();
function App(props){

  const [initializing, setInitializing] = React.useState(true);
  const [emailUser, setEmailUser] = React.useState();

  function onAuthStateChanged(user) {
    setEmailUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <StripeProvider
      publishableKey='pk_live_51L2ihZH8XcWRx3ZXuYOM0SnCIwwlymCXKouDJrEPeBoWDN1D87IJ1yMWmRZENpoPwQpBLLG4B2I7Ax10NozfO3Hr00OJkBHJuz'
      merchantIdentifier='DartMart LLC'
    >
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              headerLeft: () => null,
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name='Login' component={Onboard} />
            <Stack.Screen name='Main' component={MainTabBar} />
            <Stack.Screen name='Logout' component={SSOLogout} />
            <Stack.Screen name='EmailLogin' component={EmailLogin} />
            <Stack.Screen name='EmailSignUp' component={EmailSignup} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </StripeProvider>
  ); 
};

export default App;