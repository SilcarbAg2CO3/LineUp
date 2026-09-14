import React from 'react';
import { SafeAreaView, ScrollView, View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { mesFestivalsAutorises } from '../utils/MockData';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const HomeScreen = ({ changeScreen }) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Image source={require('../assets/LineUpLogo.jpg')} style={styles.logo} />
        </View>

        <Text style={styles.sectionTitle}>Vos Festivals</Text>

        <View style={styles.menuContainer}>
          {mesFestivalsAutorises.map((fest) => (
            <TouchableOpacity 
              key={fest} 
              style={styles.card} 
              onPress={() => changeScreen('Programmation', fest)} // 👈 On va direct à la prog
            >
              <Text style={styles.cardTitle}>{fest}</Text>
              <Text style={styles.cardDesc}>Voir les horaires et infos</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.profilBtn} onPress={() => changeScreen('Profil')}>
          <Text style={styles.profilBtnText}>👤 Mon Profil</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  header: { marginTop: 60, marginBottom: 30, alignItems: 'center' },
  logo: { width: 200, height: 200 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.textLight, marginBottom: 20 },
  menuContainer: { gap: 15 },
  card: { 
    backgroundColor: Colors.surface, 
    padding: 20, 
    borderRadius: 12, 
    borderLeftWidth: 4, 
    borderLeftColor: Colors.primary
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textLight, marginBottom: 5 },
  cardDesc: { fontSize: 14, color: Colors.textMuted },
  profilBtn: { 
    marginTop: 40, 
    paddingVertical: 15, 
    alignItems: 'center', 
    borderRadius: 8, 
    backgroundColor: Colors.primary 
  },
  profilBtnText: { 
    color: Colors.background,
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});

export default HomeScreen;