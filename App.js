import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cleachtadh Laethúil</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Irish Learning App</Text>
            <Text style={styles.subtitle}>Daily Irish Language Practice</Text>
            
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>How it works:</Text>
              <View style={styles.instructionsList}>
                <Text style={styles.instructionItem}>• View Irish words and phrases</Text>
                <Text style={styles.instructionItem}>• Flip cards to see translations</Text>
                <Text style={styles.instructionItem}>• Practice daily to improve</Text>
              </View>
            </View>
        
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Tosaigh ag Foghlaim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#047857', // Green color from original app
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#047857',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#059669',
    marginBottom: 24,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#f0fdf4', // Light green background
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 12,
  },
  instructionsList: {
    marginLeft: 8,
  },
  instructionItem: {
    fontSize: 16,
    color: '#065f46',
    marginBottom: 6,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#047857',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
