import React, { useEffect } from 'react';
import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';
import { View, StyleSheet } from 'react-native';

import { FacebookButton } from '../../components';

export const Login = ({ navigation }) => {
  useEffect(() => {
    // firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Home', { uid: user.uid });
      }
    });
  }, []);

  const authenticate = token => {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credential);
  };

  const createUser = (uid, userData) => {
    firebase.database().ref('users').child(uid).update(userData);
  };

  const login = async () => {
    await Facebook.initializeAsync('170212157356362');
    const options = {
      permissions: ['public_profile', 'email', 'user_birthday', 'user_hometown'],
    };

    const { type, token } = await Facebook.logInWithReadPermissionsAsync(options);

    if (type === 'success') {
      const fields = ['id', 'first_name', 'last_name', 'birthday', 'hometown'];
      const response = await fetch(`https://graph.facebook.com/me?fields=${fields.toString()}&access_token=${token}`);

      const userData = await response.json();
      const { user } = await authenticate(token);

      createUser(user.uid, userData);
    } else {
      console.log('Error!');
    }
  };

  return (
    <View style={styles.container}>
      <FacebookButton onPress={login} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
