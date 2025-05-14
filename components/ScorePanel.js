import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScorePanel = ({ scores }) => {
  // Calculate success rate
  const successRate = scores.totalAttempts > 0
    ? Math.round((scores.totalCorrect / scores.totalAttempts) * 100)
    : 0;

  return (
    <View style={styles.scorePanel}>
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Current Streak</Text>
        <Text style={styles.scoreValue}>{scores.currentStreak}</Text>
      </View>
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Best Streak</Text>
        <Text style={styles.scoreValue}>{scores.bestStreak}</Text>
      </View>
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Success Rate</Text>
        <Text style={styles.scoreValue}>{successRate}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scorePanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default ScorePanel;
