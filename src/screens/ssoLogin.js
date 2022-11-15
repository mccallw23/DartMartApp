import React, { useEffect, useState } from 'react';
import {
  StyleSheet, SafeAreaView, Platform, StatusBar,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { ROUTE_SSO_LOGIN, SSO_LOGIN_SERVER_URL } from '../Constants';
// import { createUser } from '../services/datastore';
import { createUser } from '../actions/index';

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

function SSOLogin(props) {
  const validateST = (ticketedURL) => {
    fetch(
      ticketedURL,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('server response:', data);
        if (data.succeeded == true) {
          // console.log('creating user');
          props.createUser(data.user.user_id, { ...data.user.user_info, isDriver: false });

          props.navigation.navigate('Main');
        } else {
          console.log(data.msg);
        }
      })
      .catch((error) => console.log('error:', error));
  };
  let ticketedURL;
  const isFocused = useIsFocused();
  const [url, setUrl] = useState(`${SSO_LOGIN_SERVER_URL}${ROUTE_SSO_LOGIN}`);
  const [tempKey, setTempKey] = useState(1);
  useEffect(() => {
    setUrl((` ${url}`).slice(1));
    setTempKey(tempKey * -1);
  }, [isFocused]);
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <WebView
        key={tempKey}
        source={{ uri: url }}
        onShouldStartLoadWithRequest={(request) => {
          console.log('onShouldStartLoadWithRequest:', request);

          if (request.url.includes('?ticket')) {
            console.log('ST url:', request.url);

            ticketedURL = request.url;
            console.log('ticketedURL:', ticketedURL);
            validateST(ticketedURL);
          } else {
            return true; // continue loaading if service ticket is not included in the url
          }
        }}
        startInLoadingState
        onMessage={(event) => {
          console.log('onMessage event:', event.nativeEvent, 'onMessage data:', event.nativeEvent.data);
        }}
      />
    </SafeAreaView>
  );
}

export default connect(null, { createUser })(SSOLogin);
