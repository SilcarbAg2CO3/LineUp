import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const ReservationCasierScreen = ({ changeScreen, festival }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  const taillesCasiers = [
    { id: 'S', label: 'Taille S', prix: 15, desc: 'Idéal pour clés, portefeuille et téléphone.', icone: '📱' },
    { id: 'M', label: 'Taille M', prix: 25, desc: 'Parfait pour un sac à dos et une veste.', icone: '🎒' },
    { id: 'XL', label: 'Taille XL', prix: 40, desc: 'Pour les groupes ou gros équipements.', icone: '📦' },
  ];


const handleContinuer = () => {
  if (!selectedSize) {
    Alert.alert("Sélection requise", "Veuillez choisir une taille de casier.");
    return;
  }
  // On navigue vers l'écran de Paiement
  changeScreen('Paiement', festival); 
};

  return (
    <SafeAreaView style={globalStyles.container}>
      
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Services', festival)}>
          <Text style={globalStyles.backButtonText}>←Services</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Réservation</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepTitle}>1. Choisissez votre taille</Text>
        <Text style={styles.stepSubtitle}>Tous les casiers sont sécurisés et accessibles 24h/24 pendant toute la durée du festival.</Text>

        <View style={styles.grid}>
          {taillesCasiers.map((taille) => {
            const isSelected = selectedSize?.id === taille.id;
            return (
              <TouchableOpacity 
                key={taille.id} 
                style={[styles.sizeCard, isSelected && styles.selectedCard]}
                onPress={() => setSelectedSize(taille)}
              >
                <Text style={styles.cardIcon}>{taille.icone}</Text>
                <Text style={styles.cardLabel}>{taille.label}</Text>
                <Text style={styles.cardPrice}>{taille.prix}€</Text>
                <Text style={styles.cardDesc}>{taille.desc}</Text>
                
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📍 Emplacement : Entrée principale (Zone Camping)</Text>
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>

      {/* Barre de pied de page avec le total et bouton */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total à régler</Text>
          <Text style={styles.totalPrice}>{selectedSize ? `${selectedSize.prix}€` : '-- €'}</Text>
        </View>
        <TouchableOpacity 
          style={[globalStyles.primaryBtn, styles.btnContinuer, !selectedSize && styles.btnDisabled]} 
          onPress={handleContinuer}
          disabled={!selectedSize}
        >
          <Text style={globalStyles.primaryBtnText}>Continuer</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 150 
  },
  stepTitle: { 
    color: Colors.textLight, 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginTop: 20, 
    marginBottom: 8 
  },
  stepSubtitle: { 
    color: Colors.textMuted, 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 25 
  },
  grid: { gap: 15 },
  sizeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative'
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(249, 140, 47, 0.05)'
  },
  cardIcon: { 
    fontSize: 30, 
    marginBottom: 10 
  },
  cardLabel: { 
    color: Colors.textLight, 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  cardPrice: { 
    color: Colors.primary, 
    fontSize: 20, 
    fontWeight: '900', 
    marginBottom: 10 
  },
  cardDesc: { 
    color: Colors.textMuted, 
    fontSize: 13, 
    lineHeight: 18, 
    paddingRight: 40 
  },
  radio: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  infoBox: { marginTop: 30, padding: 15, backgroundColor: Colors.surface, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  infoText: { color: Colors.textLight, fontSize: 14, fontStyle: 'italic' },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 100, // Juste au dessus de la TabBar
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  totalLabel: { color: Colors.textMuted, fontSize: 12, textTransform: 'uppercase' },
  totalPrice: { color: Colors.textLight, fontSize: 24, fontWeight: 'bold' },
  btnContinuer: { paddingHorizontal: 40, marginTop: 0 },
  btnDisabled: { backgroundColor: Colors.border, opacity: 0.5 }
});

export default ReservationCasierScreen;