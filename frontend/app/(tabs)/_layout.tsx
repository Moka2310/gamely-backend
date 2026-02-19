import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../src/constants/theme';
import { StatusBar } from 'expo-status-bar';

// Custom gradient icon component
const GradientIcon = ({ name, size, focused }: { name: any; size: number; focused: boolean }) => {
  if (focused) {
    return (
      <View style={styles.gradientIconContainer}>
        <LinearGradient
          colors={[COLORS.pink, COLORS.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientIcon}
        >
          <Ionicons name={name} size={size} color="white" />
        </LinearGradient>
      </View>
    );
  }
  return <Ionicons name={name} size={size} color={COLORS.textMuted} />;
};

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.pink,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Découvrir',
            tabBarIcon: ({ size, focused }) => (
              <GradientIcon name="game-controller" size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matchs',
            tabBarIcon: ({ size, focused }) => (
              <GradientIcon name="people" size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ size, focused }) => (
              <GradientIcon name="chatbubbles" size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ size, focused }) => (
              <GradientIcon name="person" size={size} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  gradientIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
