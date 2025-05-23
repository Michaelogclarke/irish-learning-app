import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Alert,
  ImageBackground,
  Animated,
  Dimensions
} from 'react-native';
import { logoutUser } from '../services/firebaseService';
import { initializeAppData, getFlashcardStats } from '../services/dataInitializer';
import Colors from '../constants/Colors';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const setupData = async () => {
      try {
        // Initialize Firebase data if needed
        const result = await initializeAppData();
        
        if (!result.success) {
          console.error('Failed to initialize data:', result.error);
        }
        
        // Get flashcard statistics
        const flashcardStats = getFlashcardStats();
        setStats(flashcardStats);
      } catch (error) {
        console.error('Error setting up data:', error);
        Alert.alert('Error', 'There was a problem initializing the app data');
      } finally {
        setLoading(false);
      }
    };
    
    setupData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your Irish learning experience...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Start Screen - similar to the original web app */}
      <View style={styles.startScreen}>
        <View style={styles.startCard}>
          <Text style={styles.title}>Cleachtadh Laethúil</Text>
          <Text style={styles.subtitle}>Daily Irish Language Practice</Text>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How it works:</Text>
            <View style={styles.instructionsList}>
              <Text style={styles.instructionItem}>• View Irish words and phrases</Text>
              <Text style={styles.instructionItem}>• Flip cards to see translations</Text>
              <Text style={styles.instructionItem}>• Practice daily to improve</Text>
            </View>
          </View>
      
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('Flashcard')}
          >
            <Text style={styles.startButtonText}>Tosaigh ag Foghlaim</Text>
          </TouchableOpacity>
        </View>
      </View>
        

      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startCard: {
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
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.primaryLight,
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
    color: Colors.primary,
    marginBottom: 12,
  },
  instructionsList: {
    marginLeft: 8,
  },
  instructionItem: {
    fontSize: 16,
    color: Colors.primaryDark,
    marginBottom: 6,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: Colors.primary,
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
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.textLight,
    fontSize: 14,
  },
});

export default HomeScreen;
