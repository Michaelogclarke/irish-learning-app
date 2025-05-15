import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

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

const styles = StyleSheet.create({
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
    backgroundColor: Colors.primary,
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
    color: Colors.textLight,
  },
  bestStreakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  successContainer: {
    alignItems: 'center',
  },
  successLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  successValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default ScorePanel;
