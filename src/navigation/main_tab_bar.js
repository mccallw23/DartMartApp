import React, { useEffect } from 'react';
import { Text, View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/homePage';
import Splash from '../screens/splashLogIn/splash'
import CartPage from '../screens/cartPage';
import Shop from '../screens/shop';
import DeliveryPage from '../screens/DeliveryPage';
import ProfilePage from '../screens/profilePage';
import DriverView from '../screens/DriverView';
import { Ionicons } from "@expo/vector-icons";
import { connect, useSelector } from 'react-redux';
import { fetchOrders } from '../actions/index';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator();

function MainTabBar(props){
  useEffect(() => {
    props.fetchOrders();
  },[])
  const user = useSelector((state) => state.user.user)
  const order = useSelector((state) => state.order.customerOrder)
  console.log("ZZZZZZ", order)

  let [themeFontLoad] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Medium.ttf'),
  });

  if (!themeFontLoad) {
    // (deprecated) prevent app from displaying without the theme font loaded in
    return <AppLoading />;
  }

  const logout = () => {
    props.navigation.navigate("Logout");
  }
  return (
      <Tab.Navigator 
      screenOptions={{
        tabBarStyle:{
          height: windowHeight * .1,
          backgroundColor: '#02604E',
          position: 'absolute'
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        headerStyle:{
          backgroundColor: '#BBDDBB',
          height: windowHeight * .15
        },
        headerTitleAlign: 'left',
        headerTitle: 'Dartmart',
        headerTitleStyle:{
          marginLeft: 30,
          fontSize: 30,
          color: '#02604E',
          fontFamily: 'Poppins',
        },
      }}>

        {user?.isDriver === false ?<Tab.Screen name="Home" component={Shop}  options={{headerShown: false, tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => (  <Ionicons name="home" color={color} size={size} />),}}/> : null }
        {user?.isDriver === false ? <Tab.Screen name="Cart" component={CartPage}  options={{headerShown: false, tabBarLabel: 'Cart', tabBarIcon: ({ color, size }) => (  <Ionicons name="cart" color={color} size={size} />),}}/>  : null}      
        {user?.isDriver === false ? <Tab.Screen name="Delivery" component={DeliveryPage}  options={{ tabBarLabel: 'Delivery', tabBarIcon: ({ color, size }) => (  <Ionicons name="pizza" color={color} size={size} />),}}/> : null }      
        <Tab.Screen name="Profile" component={ProfilePage} initialParams={{logout: logout}}  options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color, size }) => (  <Ionicons name="person-circle-outline" color={color} size={size} />),}}/>       
        {user?.isDriver === true ? <Tab.Screen name="Driver" component={DriverView}  options={{ tabBarLabel: 'Driver', tabBarIcon: ({ color, size }) => (  <Ionicons name="bicycle-outline" color={color} size={size} />),}}/> : null } 
        
      </Tab.Navigator>
  );
};

export default connect(null, { fetchOrders })(MainTabBar);
