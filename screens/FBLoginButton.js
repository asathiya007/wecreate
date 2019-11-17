import React, { Component } from 'react';
import { View, Button, Alert} from 'react-native';
import * as Facebook from 'expo-facebook';

export default class FBLoginButton extends Component {
    async logInFB() {
        try {
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
            console.log(response.json())

          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }

    render(){
        return (
            <View>
                <Button
                onPress={this.logInFB.bind(this)}
                title="Facebook Login"/>
            </View>
        )
    }
};

module.exports = FBLoginButton;