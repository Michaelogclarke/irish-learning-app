import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#047857',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{color}}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="flashcards"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <Text style={{color}}>🔤</Text>,
        }}
      />
    </Tabs>
  );
}
