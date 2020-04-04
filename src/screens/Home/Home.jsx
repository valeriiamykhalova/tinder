import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as firebase from 'firebase';
import { Card } from '../../components';

export const Home = () => {
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

  const nextCard = useCallback(() => {
    setProfileIndex((index) => index + 1);
  }, [profileIndex]);

  return (
    <View style={{ flex: 1 }}>
      {profiles &&
        profiles
          .slice(profileIndex, profileIndex + 3)
          .reverse()
          .map((profile) => <Card key={profile.id} onSwipeOff={nextCard} profile={profile} />)}
    </View>
  );
};
