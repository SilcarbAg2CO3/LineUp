import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const AjouterBilletScreen = ({ changeScreen }) => {
  const [ticketCode, setTicketCode] = useState('');

  const handleAddTicket = () => {
    // Vérification basique
    if (ticketCode.trim() === '') {
      Alert.alert("Erreur", "Veuillez entrer un numéro de billet ou de commande valide.");
      return;
    }
    
    // on fera un appel API pour vérifier et lier le billet.
    // on simule un succès et on ramène l'utilisateur sur son profil.
    Alert.alert(
      "Billet ajouté !", 
      `Le pass ${ticketCode} a été associé à votre compte avec succès. Vous avez désormais accès au Hub de ce festival !`,
      [
        { text: "Super", onPress: () => changeScreen('Profil') }
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        {/* Le bouton retour renvoie vers le Profil puisqu'on vient de là */}
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Profil')}>
          <Text style={globalStyles.backButtonText}>←Profil</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Nouveau Billet</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Entrez le code alphanumérique ou le numéro de commande inscrit sur votre preuve d'achat pour l'ajouter à l'application.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Code du billet</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ex: #CMD-F7EVH53"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters" // pour les codes de billets
            value={ticketCode}
            onChangeText={setTicketCode}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleAddTicket}>
          <Text style={styles.submitBtnText}>➕ Ajouter à mon compte</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textLight,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2, 
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitBtnText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default AjouterBilletScreen;