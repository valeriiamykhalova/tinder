import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import * as firebase from 'firebase';
import _ from 'lodash';
import { CircleImage } from '../../components';

export const Matches = ({ user, navigation }) => {
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

  const Item = ({ item }) => {
    const { id, first_name } = item;

    return (
      <TouchableHighlight onPress={() => navigation.navigate('Chat', { user, profile: item })}>
        <View style={styles.item}>
          <CircleImage size={80} id={id} />
          <Text style={{ fontSize: 18, paddingLeft: 10 }}>{first_name}</Text>
        </View>
      </TouchableHighlight>
    );
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
