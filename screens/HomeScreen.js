import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { logoutUser } from '../services/firebaseService';
import { initializeAppData, getFlashcardStats } from '../services/dataInitializer';

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
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Loading your Irish learning experience...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cleachtadh Laethúil</Text>
        <Text style={styles.subtitle}>Irish Language Flashcards</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome!</Text>
          <Text style={styles.cardText}>
            Practice your Irish language skills with our flashcard system. Learn words, phrases, and sentences at your own pace.
          </Text>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('Flashcard')}
          >
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => navigation.navigate('Filter')}
          >
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>🔍</Text>
            </View>
            <Text style={styles.optionTitle}>Filter Cards</Text>
            <Text style={styles.optionText}>Choose categories and types</Text>
          </TouchableOpacity>
          
          <View style={styles.optionCard}>
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>📊</Text>
            </View>
            <Text style={styles.optionTitle}>Flashcard Stats</Text>
            <Text style={styles.optionText}>{stats?.total || 0} cards in {stats?.categoryCount || 0} categories</Text>
          </View>
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
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#047857',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    margin: 20,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#4b5563',
    fontSize: 16,
  },
});

export default HomeScreen;
