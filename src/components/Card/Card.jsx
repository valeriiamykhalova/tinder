import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, PanResponder, Animated, Dimensions, TouchableHighlight } from 'react-native';

import moment from 'moment';

const { width, height } = Dimensions.get('window');

export const Card = ({ profile, onSwipeOff }) => {
  const { birthday, hometown, first_name, id, uid } = profile;
  const name = profile.first_name;
  const town = profile.hometown.name;

  const [isLiked, setIsLiked] = useState(false);

  const profileBirthDay = moment(birthday, 'MM/DD/YYYY');
  const profileAge = moment().diff(profileBirthDay, 'years');

  const fbImage = `https://graph.facebook.com/${id}/picture?height=500`;

  const pan = useRef(new Animated.ValueXY()).current;

  const cardPanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: (e, { dx }) => {
        const absDX = Math.abs(dx);
        const direction = absDX / dx;
        const swipedRight = direction > 0;

        if (absDX > 120) {
          Animated.decay(pan, {
            velocity: { x: 3 * direction, y: 0 },
            deceleration: 0.995,
          }).start(() => onSwipeOff(swipedRight, uid));
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 4.5,
          }).start();
        }
      },
    })
  ).current;

  const rotateCard = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['10deg', '0deg', '-10deg'],
  });

  const animatedStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: rotateCard }],
  };

  const onPress = () => {
    setIsLiked(!isLiked);
  };

  const buttonColor = isLiked ? 'red' : 'gray';

  return (
    <Animated.View {...cardPanResponder.panHandlers} style={[styles.card, animatedStyle]}>
      <Image style={{ flex: 1 }} source={{ uri: fbImage }} />
      <View style={styles.container}>
        <View>
          <Text style={{ fontSize: 20 }}>
            {name}, {profileAge}
          </Text>
          <Text style={{ fontSize: 15, color: 'darkgray' }}>{town}</Text>
        </View>
        <TouchableHighlight style={[styles.button, { backgroundColor: buttonColor }]} onPress={onPress}>
          <Text style={{ fontSize: 12, color: 'white' }}>Like</Text>
        </TouchableHighlight>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.7,
    top: (height * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    borderRadius: 88,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
});
