import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Facebook from 'expo-facebook';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Button, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';
import { thisExpression } from '@babel/types';

import axios from 'axios';

export default function App(props) {

  const [isLoadingComplete, setLoadingComplete] = useState(false)
  // important change to false after testing
  const [isLoggedIn, setLoggedIn] = useState(false)
  // const [isSubmitLogin, setSubmitLogin] = useState(false)

  // imoprtant enable fb login after testing
  // if(isSubmitLogin){
  useEffect(() => {
    const logIn = async () => {
      try {
        const current_context = this;
        const {
          type,
          token,
          expires,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync('428423121110070', {
          permissions: ['public_profile','email'],
        });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await axios(`https://graph.facebook.com/me?access_token=${token}`);
          console.log(response)
          Alert.alert('Logged in!', `Hi ${await response.data.name}!`);
          // console.log(await response.json())
          setLoggedIn(true);
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
      }
    };
    logIn();
  }, []);
  // }

  if (!isLoggedIn) {
    return(
      <View style={styles.loginContainer}>
          <Text>Hey there, please login with Facebook to use WeCreate.</Text>
          <Button
                onPress={() => loginAttempt()}
                title="Facebook Login"/>
      </View>
    );
  }else{
    if (!isLoadingComplete && !props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => handleFinishLoading(setLoadingComplete)}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }
}

async function logInFB() {
  try {
    const current_context = this;
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync('428423121110070', {
      permissions: ['public_profile'],
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
      // console.log(await response.json())
      // this.setState({isLoggedIn: true});
      setLoggedIn(true);
    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
