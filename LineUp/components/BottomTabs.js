import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '../utils/GlobalStyles';

const BottomTabs = ({ activeTab, onTabPress }) => {
  const tabs = [
    { name: 'Programmation', icon: '📅', label: 'Prog' },
    { name: 'Services', icon: '🛍️', label: 'Services' },
    { name: 'Carte', icon: '🗺️', label: 'Carte' },
    { name: 'Billets', icon: '🎟️', label: 'Billet' },
    { name: 'Favoris', icon: '⭐', label: 'Avis' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity 
            key={tab.name} style={styles.tabItem} onPress={() => onTabPress(tab.name)}
          >
            <Text style={[styles.icon, isActive && styles.activeText]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeText]}>{tab.label}</Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    height: Platform.OS === 'ios' ? 90 : 100,
    paddingBottom: Platform.OS === 'ios' ? 25 : 35,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 20, 
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  icon: { 
    fontSize: 20,
    marginBottom: 4 
  },
  label: { 
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600' 
  },
  activeText: { 
    color: Colors.primary
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 25,
    height: 3,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  }
});

export default BottomTabs;