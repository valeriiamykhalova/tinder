import React, { useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SimpleScroller = ({ screens }) => {
  const pan = useRef(new Animated.Value(0)).current;

  const scrollPanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset(pan._value);
        pan.setValue(0);
      },
      onPanResponderMove: Animated.event([null, { dx: pan }]),
      onPanResponderRelease: (e, { vx }) => {
        pan.flattenOffset();

        let move = Math.round(pan._value / width) * width;

        if (Math.abs(vx) > 0.25) {
          // 1 - swipe to the right, -1 - swipe to the left
          const direction = vx / Math.abs(vx);
          const scrollPos = direction > 0 ? Math.ceil(pan._value / width) : Math.floor(pan._value / width);

          move = scrollPos * width;
        }
        const minScroll = (screens.length - 1) * -width;

        Animated.spring(pan, {
          toValue: clamp(move, minScroll, 0),
          bouciness: 0,
        }).start();
      },
    })
  ).current;

  const clamp = (num, min, max) => {
    return num <= min ? min : num >= max ? max : num;
  };

  const animatedStyle = {
    transform: [{ translateX: pan }],
  };

  const scrollerWidth = screens.length * width;
  return (
    <Animated.View
      style={[styles.scroller, animatedStyle, { width: scrollerWidth }]}
      {...scrollPanResponder.panHandlers}
    >
      {screens.map((screen, i) => (
        <View key={i} style={{ width, height }}>
          {screen}
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
    flexDirection: 'row',
  },
});
