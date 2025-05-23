import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  StatusBar
} from 'react-native';
import { getCategories, getTypes } from '../data/flashcards';
import Colors from '../constants/Colors';

const FilterScreen = ({ navigation, route }) => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    // Load categories and types
    setCategories(getCategories());
    setTypes(getTypes());

    // Set selected filters from previous selections if available
    if (route.params?.selectedCategories) {
      setSelectedCategories(route.params.selectedCategories);
    }
    if (route.params?.selectedTypes) {
      setSelectedTypes(route.params.selectedTypes);
    }
  }, [route.params]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const toggleType = (type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories([...categories]);
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const applyFilters = () => {
    navigation.navigate('Flashcard', {
      selectedCategories,
      selectedTypes
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter Flashcards</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Types Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Type</Text>
          <View style={styles.typesContainer}>
            {types.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeItem,
                  selectedTypes.includes(type) && styles.typeItemSelected
                ]}
                onPress={() => toggleType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedTypes.includes(type) && styles.typeTextSelected
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.selectButtons}>
              <TouchableOpacity onPress={selectAllCategories}>
                <Text style={styles.selectButtonText}>Select All</Text>
              </TouchableOpacity>
              <Text style={styles.selectButtonDivider}>|</Text>
              <TouchableOpacity onPress={deselectAllCategories}>
                <Text style={styles.selectButtonText}>Deselect All</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <View key={category} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{category}</Text>
                <Switch
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={selectedCategories.includes(category) ? '#ffffff' : '#f4f3f4'}
                  ios_backgroundColor="#d1d5db"
                  onValueChange={() => toggleCategory(category)}
                  value={selectedCategories.includes(category)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={applyFilters}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
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
    borderWidth: 1,
    borderColor: 'rgba(167, 243, 208, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  selectButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButtonText: {
    color: Colors.primary,
    fontSize: 14,
  },
  selectButtonDivider: {
    color: '#d1d5db',
    marginHorizontal: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  typeItemSelected: {
    backgroundColor: Colors.primary,
  },
  typeText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  typeTextSelected: {
    color: '#ffffff',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryText: {
    fontSize: 16,
    color: '#1f2937',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterScreen;
