import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../constants/Colors';
import { getCategories, getTypes } from '../data/flashcards';

export default function FilterScreen() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectAllCategories, setSelectAllCategories] = useState(true);
  const [selectAllTypes, setSelectAllTypes] = useState(true);

  useEffect(() => {
    // Load categories and types
    const allCategories = getCategories();
    const allTypes = getTypes();
    
    setCategories(allCategories);
    setTypes(allTypes);
    
    // Initially select all categories and types
    setSelectedCategories(allCategories);
    setSelectedTypes(allTypes);
  }, []);

  // Toggle category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      const newSelected = selectedCategories.filter(c => c !== category);
      setSelectedCategories(newSelected);
      setSelectAllCategories(false);
    } else {
      setSelectedCategories([...selectedCategories, category]);
      if (selectedCategories.length + 1 === categories.length) {
        setSelectAllCategories(true);
      }
    }
  };

  // Toggle type selection
  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      const newSelected = selectedTypes.filter(t => t !== type);
      setSelectedTypes(newSelected);
      setSelectAllTypes(false);
    } else {
      setSelectedTypes([...selectedTypes, type]);
      if (selectedTypes.length + 1 === types.length) {
        setSelectAllTypes(true);
      }
    }
  };

  // Toggle all categories
  const toggleAllCategories = () => {
    if (selectAllCategories) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...categories]);
    }
    setSelectAllCategories(!selectAllCategories);
  };

  // Toggle all types
  const toggleAllTypes = () => {
    if (selectAllTypes) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([...types]);
    }
    setSelectAllTypes(!selectAllTypes);
  };

  // Apply filters and return to flashcard screen
  const applyFilters = () => {
    // In a real app, you would pass these filters back to the flashcard screen
    // For now, we'll just navigate back
    router.back();
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
          
          <View style={styles.sectionHeader}>
            <Text>Select content types to include</Text>
            <View style={styles.selectButtons}>
              <TouchableOpacity onPress={toggleAllTypes}>
                <Text style={styles.selectButtonText}>
                  {selectAllTypes ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.typesList}>
            {types.map((type) => (
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
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <View style={styles.sectionHeader}>
            <Text>Select categories to include</Text>
            <View style={styles.selectButtons}>
              <TouchableOpacity onPress={toggleAllCategories}>
                <Text style={styles.selectButtonText}>
                  {selectAllCategories ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.categoriesList}>
            {categories.map((category) => (
              <View key={category} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{category}</Text>
                <Switch
                  value={selectedCategories.includes(category)}
                  onValueChange={() => toggleCategory(category)}
                  trackColor={{ false: '#e5e7eb', true: '#a7f3d0' }}
                  thumbColor={selectedCategories.includes(category) ? Colors.primary : '#f3f4f6'}
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
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    width: 1,
    height: 14,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  typesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  typeItem: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    margin: 4,
    marginBottom: 8,
  },
  typeItemSelected: {
    backgroundColor: Colors.primary,
  },
  typeText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '500',
  },
  typeTextSelected: {
    color: '#ffffff',
  },
  categoriesList: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryText: {
    fontSize: 16,
    color: Colors.text,
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
