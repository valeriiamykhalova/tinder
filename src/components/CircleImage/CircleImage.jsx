import React from 'react';
import { Image, PixelRatio } from 'react-native';

export const CircleImage = ({ id, size }) => {
  const imgSize = PixelRatio.getPixelSizeForLayoutSize(size);
  const fbImage = `https://graph.facebook.com/${id}/picture?height=${imgSize}`;

  return <Image source={{ uri: fbImage }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
};
