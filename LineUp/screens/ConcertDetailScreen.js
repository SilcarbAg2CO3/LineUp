import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const ConcertDetailScreen = ({ changeScreen, festival, concert }) => {
  if (!concert) return null; // Sécurité

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Programmation', festival)}>
          <Text style={globalStyles.backButtonText}>← Prog.</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>{concert.artiste}</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Photo de l'artiste */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: concert.photoUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.artistImage} 
          />
        </View>

        {/* Infos clés */}
        <View style={styles.infoCard}>
          <Text style={styles.artistName}>{concert.artiste}</Text>
          <Text style={styles.concertDetails}>📅 {concert.jour} à {concert.heure}</Text>
          <Text style={styles.concertDetails}>📍 {concert.scene}</Text>
        </View>

        {/* Biographie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.bioText}>
            {concert.bio || "Biographie non disponible pour cet artiste pour le moment."}
          </Text>
        </View>

        {/* Réseaux Sociaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réseaux</Text>
          <View style={styles.socialRow}>
            <View style={styles.socialChip}>
              <Text style={styles.socialText}>📸 {concert.socials?.instagram || 'Non renseigné'}</Text>
            </View>
            <View style={styles.socialChip}>
              <Text style={styles.socialText}>🎧 {concert.socials?.spotify || 'Non renseigné'}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  imageContainer: { width: '100%', height: 250, marginBottom: -20 },
  artistImage: { width: '100%', height: '100%' },
  infoCard: { 
    backgroundColor: Colors.surface,
    marginHorizontal: 20, 
    padding: 20, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 10, 
    elevation: 5 
  },
  artistName: { color: Colors.primary, fontSize: 26, fontWeight: '900', marginBottom: 10 },
  concertDetails: { color: Colors.textLight, fontSize: 16, marginBottom: 5, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginTop: 30 },
  sectionTitle: { 
    color: Colors.textLight,
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border,
    paddingBottom: 5 
  },
  bioText: { color: Colors.textDim, fontSize: 16, lineHeight: 24 },
  socialRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  socialChip: { 
    backgroundColor: Colors.surface,
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: Colors.border
  },
  socialText: { color: Colors.textLight, fontSize: 14, fontWeight: '600' }
});

export default ConcertDetailScreen;