import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Dimensions,
  StatusBar
} from 'react-native';
import { getFlashcards, updateUserScore } from '../services/firebaseService';
import { auth } from '../firebaseConfig';
import Flashcard from '../components/Flashcard';
import ScorePanel from '../components/ScorePanel';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const FlashcardScreen = ({ navigation, route }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingEnglish, setShowingEnglish] = useState(false);
  const [scores, setScores] = useState({
    currentStreak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0
  });

  // Animation values
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadFlashcards();
  }, []);

  useEffect(() => {
    // Apply filters from route params if available
    if (route.params?.selectedCategories || route.params?.selectedTypes) {
      filterCards(route.params.selectedCategories, route.params.selectedTypes);
    } else {
      setFilteredCards(flashcards);
    }
  }, [flashcards, route.params]);

  const loadFlashcards = async () => {
    const cards = await getFlashcards();
    setFlashcards(cards);
    setFilteredCards(cards);
  };

  const filterCards = (categories, types) => {
    if (!categories?.length && !types?.length) {
      setFilteredCards(flashcards);
      return;
    }

    let filtered = [...flashcards];

    if (categories?.length) {
      filtered = filtered.filter(card => categories.includes(card.category));
    }

    if (types?.length) {
      filtered = filtered.filter(card => types.includes(card.type));
    }

    setFilteredCards(filtered);
    setCurrentIndex(0);
  };

  const flipCard = () => {
    setShowingEnglish(!showingEnglish);
    Animated.spring(flipAnimation, {
      toValue: showingEnglish ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleAnswer = async (correct) => {
    // Animate card scale
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Update score in Firebase
    if (auth.currentUser) {
      const result = await updateUserScore(auth.currentUser.uid, correct);
      if (result.success) {
        setScores(result.scores);
      }
    }

    // Update local score display
    setScores(prev => {
      const newScores = { ...prev };
      
      if (correct) {
        newScores.currentStreak += 1;
        newScores.totalCorrect += 1;
        
        if (newScores.currentStreak > newScores.bestStreak) {
          newScores.bestStreak = newScores.currentStreak;
        }
      } else {
        newScores.currentStreak = 0;
      }
      
      newScores.totalAttempts += 1;
      
      return newScores;
    });

    // Reset card to Irish side
    if (showingEnglish) {
      setShowingEnglish(false);
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }

    // Move to next card
    setCurrentIndex((currentIndex + 1) % filteredCards.length);
  };

  // Calculate success rate
  const successRate = scores.totalAttempts > 0
    ? Math.round((scores.totalCorrect / scores.totalAttempts) * 100)
    : 0;

  // Interpolate flip animation
  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
      { scale: cardScale }
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
      { scale: cardScale }
    ],
  };

  if (filteredCards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No flashcards available.</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate('Filter')}
          >
            <Text style={styles.filterButtonText}>Adjust Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cleachtadh Laethúil</Text>
        <Text style={styles.headerSubtitle}>Daily Practice</Text>
      </View>

      {/* Filter Button - Top of screen like in original */}
      <View style={styles.filterButtonTop}>
        <TouchableOpacity
          style={styles.filterButtonSmall}
          onPress={() => navigation.navigate('Filter')}
        >
          <Text style={styles.filterButtonSmallText}>Filter Categories</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Score Panel */}
        <ScorePanel scores={scores} />

        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentCard.category}</Text>
          </View>
          <View style={[styles.typeBadge, currentCard.type === 'sentence' ? styles.sentenceBadge : styles.wordBadge]}>
            <Text style={styles.typeText}>{currentCard.type}</Text>
          </View>
        </View>

      {/* Flashcard */}
      <Flashcard 
        card={currentCard} 
        flipAnimation={flipAnimation} 
        cardScale={cardScale} 
      />

      {/* Flip Button */}
      <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
        <Text style={styles.flipButtonText}>Cas</Text>
      </TouchableOpacity>

      {/* Answer Buttons */}
      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={[styles.answerButton, styles.incorrectButton]}
          onPress={() => handleAnswer(false)}
        >
          <Text style={styles.answerButtonText}>Mícheart ✗</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.answerButton, styles.correctButton]}
          onPress={() => handleAnswer(true)}
        >
          <Text style={styles.answerButtonText}>Ceart ✓</Text>
        </TouchableOpacity>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },

  filterButtonTop: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  filterButtonSmall: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterButtonSmallText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  wordBadge: {
    backgroundColor: '#eff6ff',
  },
  sentenceBadge: {
    backgroundColor: '#eef2ff',
  },
  typeText: {
    fontWeight: '600',
    fontSize: 14,
  },
  cardContainer: {
    marginBottom: 24,
  },
  flipButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  flipButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  answerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
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
  incorrectButton: {
    backgroundColor: Colors.danger,
  },
  correctButton: {
    backgroundColor: Colors.success,
  },
  answerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textLight,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  progressValue: {
    fontWeight: '600',
    color: Colors.text,
  },
});

export default FlashcardScreen;
