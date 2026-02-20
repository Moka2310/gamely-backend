import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children, style }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default BackgroundWrapper;
