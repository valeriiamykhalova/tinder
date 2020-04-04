import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome';

export const FacebookButton = ({ onPress }) => {
  return (
    <TouchableHighlight style={styles.button} onPress={onPress}>
      <View style={styles.buttonContainer}>
        <Icon name="facebook-f" size={20} color="white" />
        <Text style={styles.buttonText}>Login with Facebook</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 220,
    height: 40,
    backgroundColor: '#3b5998',
    borderRadius: 50,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    marginLeft: 15,
  },
});
