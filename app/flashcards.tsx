import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../constants/Colors';
import { flashcards, getCategories, getTypes } from '../data/flashcards';

// Flashcard component
const Flashcard = ({ card, isFlipped, onPress }) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);
  
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  
  // Add opacity interpolation for smoother transitions
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };
  
  return (
    <TouchableOpacity 
      style={styles.flashcardContainer} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.flashcardWrapper}>
        <Animated.View style={[styles.flashcard, styles.flashcardFront, frontAnimatedStyle]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{card.category}</Text>
          </View>
          <Text style={styles.cardText}>{card.irish}</Text>
          <Text style={styles.cardType}>{card.type}</Text>
        </Animated.View>
        
        <Animated.View style={[styles.flashcard, styles.flashcardBack, backAnimatedStyle]}>
          <Text style={styles.cardTextEnglish}>{card.english}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

// Score Panel component
const ScorePanel = ({ scores }) => {
  // Calculate success rate
  const successRate = scores.totalAttempts > 0 
    ? Math.round((scores.totalCorrect / scores.totalAttempts) * 100) 
    : 0;
  
  return (
    <View style={styles.scorePanel}>
      <View style={styles.scoreRow}>
        <View style={styles.streakContainer}>
          <View style={styles.streakCounter}>
            <Text style={styles.streakLabel}>Streak</Text>
            <Text style={styles.streakValue}>{scores.currentStreak}</Text>
          </View>
          <View style={styles.bestStreakContainer}>
            <Text style={styles.bestStreakLabel}>Best Streak</Text>
            <Text style={styles.bestStreakValue}>{scores.bestStreak}</Text>
          </View>
        </View>
        <View style={styles.successContainer}>
          <Text style={styles.successLabel}>Success Rate</Text>
          <Text style={styles.successValue}>{successRate}%</Text>
        </View>
      </View>
    </View>
  );
};

export default function FlashcardScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scores, setScores] = useState({
    currentStreak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0
  });
  const [filteredCards, setFilteredCards] = useState(flashcards);
  const [selectedCategories, setSelectedCategories] = useState(getCategories());
  const [selectedTypes, setSelectedTypes] = useState(getTypes());
  
  // Load scores from AsyncStorage on component mount
  useEffect(() => {
    const loadScores = async () => {
      try {
        const savedScores = await AsyncStorage.getItem('scores');
        if (savedScores) {
          setScores(JSON.parse(savedScores));
        }
      } catch (error) {
        console.error('Error loading scores:', error);
      }
    };
    
    loadScores();
  }, []);
  
  // Save scores to AsyncStorage whenever they change
  useEffect(() => {
    const saveScores = async () => {
      try {
        await AsyncStorage.setItem('scores', JSON.stringify(scores));
      } catch (error) {
        console.error('Error saving scores:', error);
      }
    };
    
    saveScores();
  }, [scores]);
  
  // Load filters from AsyncStorage
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const savedCategories = await AsyncStorage.getItem('selectedCategories');
        const savedTypes = await AsyncStorage.getItem('selectedTypes');
        
        if (savedCategories) {
          setSelectedCategories(JSON.parse(savedCategories));
        }
        
        if (savedTypes) {
          setSelectedTypes(JSON.parse(savedTypes));
        }
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    
    loadFilters();
  }, []);
  
  // Apply filters to flashcards
  useEffect(() => {
    const filtered = flashcards.filter(card => 
      selectedCategories.includes(card.category) && 
      selectedTypes.includes(card.type)
    );
    
    setFilteredCards(filtered.length > 0 ? filtered : flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategories, selectedTypes]);
  
  // Function to handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Function to handle correct answer
  const handleCorrect = () => {
    // Always update scores regardless of flip state
    const newScores = { ...scores };
    newScores.currentStreak += 1;
    newScores.totalCorrect += 1;
    newScores.totalAttempts += 1;
    
    if (newScores.currentStreak > newScores.bestStreak) {
      newScores.bestStreak = newScores.currentStreak;
    }
    
    setScores(newScores);
    
    // Move to next card
    goToNextCard();
  };
  
  // Function to handle incorrect answer
  const handleIncorrect = () => {
    // Update scores
    const newScores = { ...scores };
    newScores.currentStreak = 0; // Reset streak
    newScores.totalAttempts += 1;
    setScores(newScores);
    
    // Move to next card
    goToNextCard();
  };
  
  // Function to go to next card
  const goToNextCard = () => {
    // Reset flip state
    setIsFlipped(false);
    
    // If we've reached the end of the cards, loop back to the beginning
    if (currentIndex >= filteredCards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  // Function to go to filter screen
  const goToFilter = () => {
    router.push('/filter');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 40 : 16 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Practice Irish</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={goToFilter}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Score Panel */}
        <ScorePanel scores={scores} />
        
        {/* Flashcard */}
        {filteredCards.length > 0 && (
          <Flashcard 
            card={filteredCards[currentIndex]} 
            isFlipped={isFlipped} 
            onPress={handleFlip} 
          />
        )}
        
        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.flipButton]}
            onPress={handleFlip}
          >
            <Text style={[styles.controlButtonText, { color: '#ffffff' }]}>Cas</Text>
          </TouchableOpacity>
          
          <View style={styles.answerButtons}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.correctButton]}
              onPress={handleCorrect}
            >
              <Text style={styles.controlButtonText}>Ceart ✓</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.incorrectButton]}
              onPress={handleIncorrect}
            >
              <Text style={styles.controlButtonText}>Mícheart ✗</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Progress Indicator - Like in original */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Dul chun cinn: <Text style={styles.progressValue}>{currentIndex + 1}/{filteredCards.length}</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = Math.min(width - 40, 400);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // Using direct color value instead of Colors.background
  },
  header: {
    backgroundColor: '#047857',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  filterButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Score Panel Styles
  scorePanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(167, 243, 208, 0.2)',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  streakCounter: {
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 16,
  },
  streakLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bestStreakContainer: {
    alignItems: 'center',
  },
  bestStreakLabel: {
    fontSize: 12,
    color: '#ffffff',
  },
  bestStreakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  successContainer: {
    alignItems: 'center',
  },
  successLabel: {
    fontSize: 12,
    color: '#ffffff',
  },
  successValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // Flashcard Styles
  flashcardContainer: {
    width: cardWidth,
    height: cardWidth * 0.7,
    alignSelf: 'center',
    marginVertical: 16,
  },
  flashcardWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  flashcard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  flashcardFront: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(167, 243, 208, 0.3)',
  },
  flashcardBack: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: 'rgba(167, 243, 208, 0.5)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(4, 120, 87, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#047857',
    textAlign: 'center',
    fontFamily: 'CrimsonPro-Bold',
  },
  cardTextEnglish: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#047857',
    textAlign: 'center',
  },
  cardType: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    color: '#ffffff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  // Controls Styles
  controls: {
    marginTop: 16,
  },
  controlButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flipButton: {
    backgroundColor: '#047857',
    marginBottom: 12,
  },
  answerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incorrectButton: {
    backgroundColor: '#fee2e2',
    flex: 1,
    marginRight: 8,
  },
  correctButton: {
    backgroundColor: '#dcfce7',
    flex: 1,
    marginLeft: 8,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Progress Indicator
  progressContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
  },
  progressValue: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
