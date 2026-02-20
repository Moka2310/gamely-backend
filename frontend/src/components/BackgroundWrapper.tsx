import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle, View } from 'react-native';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  opacity?: number;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children, style, opacity = 0.3 }) => {
  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { backgroundColor: `rgba(10, 10, 15, ${1 - opacity})` }]}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default BackgroundWrapper;
