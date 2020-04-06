import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { GeoFire } from 'geofire';
import { Card, SimpleScroller } from '../../components';
import { Profile } from '../Profile';
import { Matches } from '../Matches';
import filter from '../../modules/filter';

export const Home = ({ route }) => {
  const [profiles, setProfiles] = useState([]);
  const [profileIndex, setProfileIndex] = useState(0);
  const [user, setUser] = useState(route.params.user);

  useEffect(() => {
    const { uid } = user;

    firebase
      .database()
      .ref('users')
      .child(uid)
      .on('value', (snap) => {
        const updatedUser = snap.val();

        setUser(updatedUser);
        setProfiles([]);
        setProfileIndex(0);

        getProfiles(updatedUser);
      });

    updateUserLocation(uid);
  }, []);

  const getUser = (uid) => {
    return firebase.database().ref('users').child(uid).once('value');
  };

  const getSwiped = (uid) => {
    return firebase
      .database()
      .ref('relationships')
      .child(uid)
      .child('liked')
      .once('value')
      .then((snap) => snap.val() || {});
  };

  const getProfiles = async (updatedUser) => {
    const swipedProfiles = await getSwiped(updatedUser.uid);
    // const geoFireRef = new GeoFire(firebase.database().ref('geoData'));
    // const userLocation = await geoFireRef.get(uid);

    // // Add users to main prfile, who are 10km from him
    // const geoQuery = geoFireRef.query({
    //   center: userLocation,
    //   radius: 10,
    // });

    // geoQuery.on('key_entered', async (key, location, distance) => {
    //   const user = await getUser(uid);
    //   setProfiles([...profiles, user.val()]);
    // });

    // temporary user data without location coordinates
    firebase
      .database()
      .ref()
      .child('users')
      .once('value', (snap) => {
        const profilesArray = [];
        snap.forEach((profile) => {
          const { first_name, hometown, birthday, gender, id, uid } = profile.val();

          profilesArray.push({ first_name, hometown, birthday, gender, id, uid });
        });

        const filteredProfiles = filter(profilesArray, updatedUser, swipedProfiles);
        setProfiles(filteredProfiles);
      });
  };

  const updateUserLocation = async (uid) => {
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

  const relate = (userUid, profileUid, status) => {
    const relationUpdate = {};
    relationUpdate[`${userUid}/liked/${profileUid}`] = status;
    relationUpdate[`${profileUid}/liked/${userUid}`] = status;

    firebase.database().ref('relationships').update(relationUpdate);
  };

  const nextCard = useCallback(
    (swipedRight, profileUid) => {
      const userUid = user.uid;
      setProfileIndex((index) => index + 1);

      if (swipedRight) {
        relate(userUid, profileUid, true);
      } else {
        relate(userUid, profileUid, false);
      }
    },
    [profileIndex]
  );

  const cardStack = () => {
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

  return <SimpleScroller screens={[<Profile user={user} />, cardStack(), <Matches user={user} />]} />;
};
