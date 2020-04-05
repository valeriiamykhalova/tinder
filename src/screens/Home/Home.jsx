import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { GeoFire } from 'geofire';
import { Card } from '../../components';

export const Home = ({ route }) => {
  const [profiles, setProfiles] = useState([]);
  const [profileIndex, setProfileIndex] = useState(0);

  useEffect(() => {
    const { uid } = route.params;
    updateUserLocation(uid);
    getProfiles(uid);

    // firebase
    //   .database()
    //   .ref()
    //   .child('users')
    //   .once('value', snap => {
    //     const profilesArray = [];
    //     snap.forEach(profile => {
    //       const { name, bio, birthday, id } = profile.val();

    //       profilesArray.push({ name, bio, birthday, id });
    //     });

    //     setProfiles(profilesArray);
    //   });
  }, []);

  const getUser = uid => {
    return firebase.database().ref('users').child(uid).once('value');
  };

  const getProfiles = async uid => {
    const geoFireRef = new GeoFire(firebase.database().ref('geoData'));
    const userLocation = await geoFireRef.get(uid);

    // Add users to main prfile, who are 10km from him
    const geoQuery = geoFireRef.query({
      center: userLocation,
      radius: 10,
    });

    geoQuery.on('key_entered', async (key, location, distance) => {
      const user = await getUser(uid);
      setProfiles([...profiles, user.val()]);
    });
  };

  const updateUserLocation = async uid => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: false });
      const { latitude, longitude } = location.coords;

      const geoFireRef = new GeoFire(firebase.database().ref('geoData'));
      geoFireRef.set(uid, [latitude, longitude]);
    } else {
      console.log('Permission Denied');
    }
  };

  const nextCard = useCallback(() => {
    setProfileIndex(index => index + 1);
  }, [profileIndex]);

  return (
    <View style={{ flex: 1 }}>
      {profiles &&
        profiles
          .slice(profileIndex, profileIndex + 3)
          .reverse()
          .map(profile => <Card key={profile.id} onSwipeOff={nextCard} profile={profile} />)}
    </View>
  );
};
