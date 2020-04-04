import { registerRootComponent } from 'expo';

import React from 'react';
import * as firebase from 'firebase';
import { Home } from './src/screens';

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

export default function App() {
  return <Home />;
}

registerRootComponent(App);
