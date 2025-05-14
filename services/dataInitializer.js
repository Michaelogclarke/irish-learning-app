import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFlashcardsInFirestore } from './firebaseService';
import { flashcards } from '../data/flashcards';

// Key for checking if data has been initialized
const DATA_INITIALIZED_KEY = 'irish_learning_data_initialized';

/**
 * Initializes the app data in Firebase if it hasn't been done yet
 * This ensures we only seed the database once
 */
export const initializeAppData = async () => {
  try {
    // Check if data has already been initialized
    const initialized = await AsyncStorage.getItem(DATA_INITIALIZED_KEY);
    
    if (!initialized) {
      console.log('Initializing app data in Firebase...');
      
      // Initialize flashcards in Firestore
      const result = await initializeFlashcardsInFirestore();
      
      if (result.success) {
        // Mark as initialized to prevent duplicate data
        await AsyncStorage.setItem(DATA_INITIALIZED_KEY, 'true');
        console.log('App data initialized successfully');
        return { success: true };
      } else {
        console.error('Failed to initialize app data:', result.error);
        return { success: false, error: result.error };
      }
    } else {
      console.log('App data already initialized');
      return { success: true, alreadyInitialized: true };
    }
  } catch (error) {
    console.error('Error initializing app data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Gets the total number of flashcards available
 */
export const getFlashcardStats = () => {
  const categories = new Set();
  const types = new Set();
  
  flashcards.forEach(card => {
    categories.add(card.category);
    types.add(card.type);
  });
  
  return {
    total: flashcards.length,
    categories: Array.from(categories),
    categoryCount: categories.size,
    types: Array.from(types),
    typeCount: types.size
  };
};
