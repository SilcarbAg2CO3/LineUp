import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

// On garde des fausses données locales pour le moment, les icones des légendes sont ajoutées sur la carte par les admins sur le client riche
const baseDeDonneesCartes = [
  {
    festival: 'Summerside 2026',
    imageSource: require('../assets/dust2Map.png'), 
    legende: ['🎸 Main Stage (Nord)', '🎪 Chapiteau Électro (Sud)', '🍔 Food Court Central', '🍻 Bar de la Plage', '🚻 Toilettes (Est & Ouest)', '⛺ Entrée Camping']
  },
  {
    festival: 'Hellfest 2026',
    imageSource: require('../assets/Mapa_Skyrim.png'), 
    legende: ['🔥 Main Stage 1 & 2', '💀 Warzone', '🤘 Hellcity Square', '🍻 Bar', '🚻 Toilettes VIP', '🚑 Croix-Rouge']
  }
];

//ajoute "festival" dans les paramètres récupérés
const CarteScreen = ({ changeScreen, festival }) => {
  // cherche directement la carte qui correspond à la prop "festival"
  const donneesCarte = baseDeDonneesCartes.find(carte => carte.festival === festival);

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Home')}>
          <Text style={globalStyles.backButtonText}>←Accueil</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>{festival}</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.mapScrollContainer}>
        {donneesCarte ? (
          <>
            <View style={styles.mapImageContainer}>
             <Image source={donneesCarte.imageSource} style={styles.mapImage} resizeMode="contain"/>

              <Text style={styles.mapTip}>🔍 Pincez pour zoomer (bientôt disponible)</Text>
            </View>

            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Légende & Points d'intérêt</Text>
              
              {donneesCarte.legende.map((point, index) => (
                <View key={index} style={styles.legendItemRow}>
                  <View style={styles.legendDot} />
                  <Text style={styles.legendText}>{point}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          /*Si pas de carte trouvée */
          <Text style={globalStyles.emptyMessage}>Plan non disponible pour ce festival.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapScrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  mapImageContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapImage: {
    width: '100%',
    height: 250,
  },
  mapTip: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 15,
  },
  legendContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  legendTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border, 
    paddingBottom: 10,
  },
  legendItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginRight: 15,
  },
  legendText: {
    color: Colors.textDim,
    fontSize: 15,
  }
});

export default CarteScreen;