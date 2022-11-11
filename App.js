import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
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
import { PUBLISHABLE_KEY_LIVE, PUBLISHABLE_KEY_TEST } from '@env';


// disable really annoying in app warnings
LogBox.ignoreAllLogs();
const store = configureStore({
  reducer: rootReducer
})

const Stack = createStackNavigator();
function App(props){
  return(
    <StripeProvider publishableKey={PUBLISHABLE_KEY_LIVE}
    merchantIdentifier='DartMart LLC'>
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          headerLeft: () => null,
          gestureEnabled: false,
        }}
        >
          <Stack.Screen name="Login" component={Onboard} />
          <Stack.Screen name="Main" component={MainTabBar} />
          <Stack.Screen name="Logout" component={SSOLogout} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    </StripeProvider>
  ); 
};

export default App;