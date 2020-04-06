import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import * as firebase from 'firebase';
import { Home, Login, Chat } from './src/screens';

const firebaseConfig = {
  apiKey: 'AIzaSyBSCA5BdipocXoJOkPguXsLUbmbU-6o8YE',
  authDomain: 'clonetinder-2b66f.firebaseapp.com',
  databaseURL: 'https://clonetinder-2b66f.firebaseio.com',
  projectId: 'clonetinder-2b66f',
  storageBucket: 'clonetinder-2b66f.appspot.com',
  messagingSenderId: '175557174552',
  appId: '1:175557174552:web:a0387dd8291470d5552a6d',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
