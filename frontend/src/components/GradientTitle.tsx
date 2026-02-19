import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { COLORS } from '../constants/theme';

interface GradientTitleProps {
  children: string;
  size?: number;
}

export const GradientTitle = ({ children, size = 28 }: GradientTitleProps) => {
  return (
    <MaskedView
      style={{ height: size + 10 }}
      maskElement={
        <Text style={[styles.title, { fontSize: size }]}>{children}</Text>
      }
    >
      <LinearGradient
        colors={[COLORS.pink, COLORS.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
});

export default GradientTitle;
