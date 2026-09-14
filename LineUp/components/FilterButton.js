import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/GlobalStyles';

const FilterButton = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity style={[styles.filterBtn, isActive && styles.filterBtnActive]} onPress={onPress}>
      <Text style={[styles.filterBtnText, isActive && styles.filterBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterBtn: { 
    backgroundColor: Colors.surface,
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20,
    marginRight: 10, 
  },
  filterBtnActive: { 
    backgroundColor: Colors.primary
  },
  filterBtnText: { 
    color: Colors.textMuted,
    fontWeight: '600' 
  },
  filterBtnTextActive: { 
    color: Colors.background, 
    fontWeight: 'bold' 
  }
});

export default FilterButton;