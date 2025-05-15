import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FlashcardScreen from '../screens/FlashcardScreen';
import FilterScreen from '../screens/FilterScreen';
import TestScreen from '../screens/TestScreen';

// Firebase
import { getCurrentUser } from '../services/firebaseService';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#047857', // Green color similar to the original app
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Cleachtadh Laethúil - Login' }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Cleachtadh Laethúil - Register' }} 
      />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#047857',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="Test"
    >
      <Stack.Screen 
        name="Test" 
        component={TestScreen} 
        options={{ title: 'Cleachtadh Laethúil', headerShown: false }} 
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Cleachtadh Laethúil' }} 
      />
      <Stack.Screen 
        name="Flashcard" 
        component={FlashcardScreen} 
        options={{ title: 'Practice' }} 
      />
      <Stack.Screen 
        name="Filter" 
        component={FilterScreen} 
        options={{ title: 'Filter Flashcards' }} 
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  // Temporarily bypass authentication for development
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bypassAuth, setBypassAuth] = useState(true); // Temporary flag to bypass auth

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const currentUser = await getCurrentUser();
  //     setUser(currentUser);
  //     setLoading(false);
  //   };

  //   checkUser();
  // }, []);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {bypassAuth ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
