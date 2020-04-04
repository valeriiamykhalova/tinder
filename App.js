import { registerRootComponent } from 'expo';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as firebase from 'firebase';
import { Card } from './components/Card';

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
  const [profiles, setProfiles] = useState([]);
  const [profileIndex, setProfileIndex] = useState(0);

  useEffect(() => {
    firebase
      .database()
      .ref()
      .child('users')
      .once('value', (snap) => {
        const profilesArray = [];
        snap.forEach((profile) => {
          const { name, bio, birthday, id } = profile.val();

          profilesArray.push({ name, bio, birthday, id });
        });

        setProfiles(profilesArray);
      });
  }, []);

  const nextCard = () => {
    setProfileIndex(profileIndex + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      {profiles &&
        profiles
          .slice(profileIndex, profileIndex + 3)
          .reverse()
          .map((profile) => <Card key={profile.id} onSwipeOff={nextCard} profile={profile} />)}
    </View>
  );
}

registerRootComponent(App);
