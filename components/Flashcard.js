import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const Flashcard = ({ card, flipAnimation, cardScale }) => {
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

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.card, styles.cardFront, styles.cardTexture, frontAnimatedStyle]}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{card.irish}</Text>
          <Text style={styles.cardCategory}>{card.category}</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.card, styles.cardBack, styles.cardTexture, backAnimatedStyle]}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{card.english}</Text>
          <Text style={styles.cardCategory}>{card.category}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTexture: {
    // This recreates the card texture from the original web app
    backgroundColor: '#ffffff',
    // We can't directly use the linear-gradient background from CSS,
    // but we can approximate it with a solid color for now
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    // In a production app, we would use the Crimson Pro font here
  },
  cardCategory: {
    fontSize: 14,
    color: Colors.primaryLight,
    textAlign: 'center',
  },
});

export default Flashcard;
