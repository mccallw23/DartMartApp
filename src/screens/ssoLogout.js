import React from 'react';
import {
  StyleSheet, SafeAreaView, Platform, StatusBar, View, Button,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { ROUTE_SSO_LOGOUT, SSO_LOGIN_SERVER_URL } from '../Constants';

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default function SSOLogout({ navigation }) {
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <WebView
        source={{ uri: `${SSO_LOGIN_SERVER_URL}${ROUTE_SSO_LOGOUT}` }}
        startInLoadingState
        onMessage={(event) => {
          console.log('onMessage event:', event.nativeEvent, 'onMessage data:', event.nativeEvent.data);
        }}
      />
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          title="Login"
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
      </View>
    </SafeAreaView>
  );
}
