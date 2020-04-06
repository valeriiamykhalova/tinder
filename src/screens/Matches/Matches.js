import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Text } from 'react-native';
import * as firebase from 'firebase';
import _ from 'lodash';
import { CircleImage } from '../../components';

// const profilesArr = [
//   {
//     id: '100017778812917',
//     first_name: 'Svitlana',
//     birthday: '06/01/1996',
//     gender: 'female',
//     hometown: {
//       id: 1,
//       name: 'Будапешт',
//     },
//   },
//   {
//     id: '100011778877261',
//     first_name: 'Tamara',
//     birthday: '06/19/1999',
//     gender: 'female',
//     hometown: {
//       id: 2,
//       name: 'Киев',
//     },
//   },
//   {
//     id: '100025993943813',
//     first_name: 'Igor',
//     birthday: '08/11/1990',
//     gender: 'male',
//     hometown: {
//       id: 3,
//       name: 'Хмельницкий',
//     },
//   },
//   {
//     id: '100006084185765',
//     first_name: 'Irina',
//     gender: 'female',
//     birthday: '06/01/1993',
//     hometown: {
//       id: 3,
//       name: 'Хмельник',
//     },
//   },
// ];

const Item = ({ item }) => {
  const { id, first_name } = item;
  return (
    <View style={styles.item}>
      <CircleImage size={80} id={id} />
      <Text style={{ fontSize: 18, paddingLeft: 10 }}>{first_name}</Text>
    </View>
  );
};

export const Matches = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMatches(user.uid);
  }, []);

  const getOverlap = (liked, likedBack) => {
    const likeTrue = _.pickBy(liked, (value) => value);
    const likeBackTrue = _.pickBy(likedBack, (value) => value);

    return _.intersection(_.keys(likeTrue), _.keys(likeBackTrue));
  };

  const getUser = (uid) => {
    return firebase
      .database()
      .ref('users')
      .child(uid)
      .once('value')
      .then((snap) => snap.val());
  };

  const getMatches = (uid) => {
    firebase
      .database()
      .ref('relationships')
      .child(uid)
      .on('value', (snap) => {
        const relations = snap.val();
        const allMatches = getOverlap(relations.liked, relations.likedBack);

        const promises = allMatches.map((profileUid) => getUser(profileUid));

        Promise.all(promises).then((data) => setData(data));
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={data} renderItem={({ item }) => <Item item={item} />} keyExtractor={(item) => item.id} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 1,
    marginHorizontal: 1,
  },
});
