import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const ServicesScreen = ({ changeScreen, festival }) => {
  
  // Liste des services dispo
  const services = [
    {
      id: 'casiers',
      titre: '🔐 Casiers & Consignes',
      description: 'Réservez un espace sécurisé pour vos effets personnels.',
      action: () => changeScreen('ReservationCasier', festival),
      disponible: true
    },
    {
      id: 'cashless',
      titre: '💳 Rechargement Cashless',
      description: 'Évitez les files d\'attente et rechargez votre bracelet en ligne.',
      action: () => {}, // À implémenter plus tard
      disponible: false // Simule un service pas encore ouvert
    },
    {
      id: 'boutique',
      titre: '👕 Boutique Merch',
      description: 'Click & Collect : commandez vos t-shirts et récupérez-les sur place.',
      action: () => {}, // À implémenter plus tard
      disponible: false
    }
  ];

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Home')}>
          <Text style={globalStyles.backButtonText}>←Accueil</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>{festival}</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.introText}>
          Optimisez votre expérience à {festival} avec nos services exclusifs.
        </Text>

        <View style={styles.menuContainer}>
          {services.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.serviceCard, !item.disponible && styles.disabledCard]} 
              onPress={item.action}
              disabled={!item.disponible}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.titre}</Text>
                {!item.disponible && <Text style={styles.badgeBientot}>Bientôt</Text>}
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>
              
              {item.disponible && (
                <Text style={styles.actionLink}>Accéder au service →</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.helpBox}>
          <Text style={styles.helpText}>Besoin d'aide ?</Text>
          <Text style={styles.helpSub}>Consultez notre FAQ ou contactez le support du festival.</Text>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 120 
  },
  introText: {
    color: Colors.textDim,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  menuContainer: { 
    gap: 20 
  },
  serviceCard: { 
    backgroundColor: Colors.surface, 
    padding: 20, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  disabledCard: {
    opacity: 0.6,
    borderColor: 'transparent'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: Colors.textLight 
  },
  badgeBientot: {
    backgroundColor: Colors.border,
    color: Colors.textMuted,
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  cardDesc: { 
    fontSize: 14, 
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: 15
  },
  actionLink: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'right'
  },
  helpBox: {
    marginTop: 40,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 140, 47, 0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border
  },
  helpText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  helpSub: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center'
  }
});

export default ServicesScreen;