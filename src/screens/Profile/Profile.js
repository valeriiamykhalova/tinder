import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import * as firebase from 'firebase';
// import Slider from 'react-native-multi-slider';
import { CircleImage } from '../../components';

export const Profile = ({ user }) => {
  const name = user.first_name;
  const [showMen, setShowMen] = useState(user.showMen);
  const [showWomen, setShowWomen] = useState(user.showWomen);

  const updateUser = (key, value) => {
    const { uid } = user;
    firebase
      .database()
      .ref('users')
      .child(uid)
      .update({ [key]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <CircleImage id={user.id} size={120} />
        <Text>{name}</Text>
      </View>
      {/* <Slider
        values={[0, 10]}
        step={20}
        selectionColor="#3df"
        blankColor="#f618"
        onValueChanged={(low, high, fromUser) => {
          this.setState({ rangeLow: low, rangeHigh: high });
        }}
      /> */}
      <View style={styles.switch}>
        <Text>Show Men</Text>
        <Switch
          value={showMen}
          onValueChange={(val) => {
            setShowMen(val);
            updateUser('showMen', val);
          }}
        />
      </View>
      <View style={styles.switch}>
        <Text>Show Women</Text>
        <Switch
          value={showWomen}
          onValueChange={(val) => {
            setShowWomen(val);
            updateUser('showWomen', val);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
  },
});
