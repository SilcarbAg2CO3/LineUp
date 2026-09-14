import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import ConcertCard from '../components/ConcertCard';
import FilterButton from '../components/FilterButton';
import useFestivals from '../hooks/UseFestivals';
import { baseDeDonneesConcerts, mesFestivalsAutorises } from '../utils/MockData';
import { globalStyles } from '../utils/GlobalStyles';

const ProgrammationScreen = ({ changeScreen, festival }) => {
  const {
    changerDeFestival,
    joursDynamiques,
    jourChoisi,
    setJourChoisi,
    scenesDynamiques,
    sceneChoisie,
    setSceneChoisie,
    concertsFiltres
  } = useFestivals(baseDeDonneesConcerts, mesFestivalsAutorises);

  useEffect(() => {
    if (festival) changerDeFestival(festival);
  }, [festival]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        {/* Retour à l'accueil */}
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Home')}>
          <Text style={globalStyles.backButtonText}>←Accueil</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>{festival}</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {joursDynamiques.map((jour) => (
            <FilterButton 
              key={jour}
              label={jour}
              isActive={jourChoisi === jour}
              onPress={() => setJourChoisi(jour)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {scenesDynamiques.map((scene) => (
            <FilterButton 
              key={scene}
              label={scene}
              isActive={sceneChoisie === scene}
              onPress={() => setSceneChoisie(scene)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.concertList}>
        {concertsFiltres.length > 0 ? (
          concertsFiltres.map((concert) => (
            <ConcertCard 
              key={concert.id} 
              concert={concert} 
              onPress={() => changeScreen('ConcertDetail', festival, concert)} 
            />
          ))
        ) : (
          <Text style={globalStyles.emptyMessage}>Aucun concert prévu avec ces critères.</Text>
        )}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterSection: { marginBottom: 15 },
  filterScroll: { paddingHorizontal: 15, gap: 10 },
  concertList: { 
    paddingHorizontal: 15, 
    paddingBottom: 110, // Laisse la place pour les onglets
    gap: 15, 
    marginTop: 10 
  }
});

export default ProgrammationScreen;