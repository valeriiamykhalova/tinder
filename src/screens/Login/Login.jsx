import React, { useEffect, useState } from 'react';
import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { CommonActions } from '@react-navigation/native';

import { FacebookButton } from '../../components';

export const Login = ({ navigation }) => {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    // firebase.auth().signOut();
    firebase.auth().onAuthStateChanged((auth) => {
      if (auth) {
        const firebaseRef = firebase.database().ref('users');
        firebaseRef.child(auth.uid).on('value', (snap) => {
          const user = snap.val();

          if (user != null) {
            firebaseRef.child(auth.uid).off('value');
            goHome(user);
          }
        });
      } else {
        setShowSpinner(false);
      }
    });
  }, []);

  const goHome = (user) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'Home',
            params: { user },
          },
        ],
      })
    );
  };

  const authenticate = (token) => {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credential);
  };

  const createUser = (uid, userData) => {
    firebase
      .database()
      .ref('users')
      .child(uid)
      .update({ ...userData, uid });
  };

  const login = async () => {
    setShowSpinner(true);

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
      {showSpinner ? <ActivityIndicator animating={showSpinner} /> : <FacebookButton onPress={login} />}
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
