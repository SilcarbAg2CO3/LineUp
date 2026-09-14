import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const PaiementScreen = ({ changeScreen, festival }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // 1. Fonction pour formater automatiquement la carte bleue (1 espace tous les 4 chiffres)
  const formatCardNumber = (text) => {
    // Retire tout ce qui n'est pas un chiffre
    const cleaned = text.replace(/\D/g, '');
    // Ajoute un espace après chaque groupe de 4 chiffres
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // 2. Fonction pour formater automatiquement la date d'expiration (MM/AA)
  const formatExpiry = (text) => {
    // Retire tout ce qui n'est pas un chiffre
    const cleaned = text.replace(/\D/g, '');
    // Ajoute le slash automatiquement après le mois
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    setExpiry(formatted);
  };

  const handlePayer = () => {
    // On retire les espaces pour vérifier la vraie longueur de la carte
    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    // On vérifie que la carte a 16 chiffres, la date 5 caractères (MM/AA) et le CVV 3 chiffres
    if (cleanCardNumber.length < 16 || expiry.length < 5 || cvv.length < 3) {
      Alert.alert("Erreur", "Veuillez remplir correctement vos informations de paiement.");
      return;
    }

    // Simulation de traitement
    Alert.alert(
      "Paiement validé ! 🔒",
      "Votre réservation de casier est confirmée. Retrouvez votre code d'accès dans l'onglet 'Billets'.",
      [{ text: "Génial !", onPress: () => changeScreen('Billets', festival) }]
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('ReservationCasier', festival)}>
          <Text style={globalStyles.backButtonText}>←Retour</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Paiement</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Récapitulatif Rapide */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Service : Réservation Casier M</Text>
          <Text style={styles.summaryTotal}>Total : 25,00 €</Text>
        </View>

        <Text style={styles.sectionTitle}>Paiement rapide</Text>
        <TouchableOpacity style={styles.applePayBtn}>
          <Text style={styles.applePayText}>Payer avec {Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay'}</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU PAR CARTE</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Formulaire Carte */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Numéro de carte</Text>
            <TextInput 
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              maxLength={19}
              value={cardNumber}
              onChangeText={formatCardNumber} //  On utilise la nouvelle fonction
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Expiration</Text>
              <TextInput 
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={5}
                value={expiry}
                onChangeText={formatExpiry} // pareil 
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput 
                style={styles.input}
                placeholder="123"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[globalStyles.primaryBtn, styles.btnPay]} onPress={handlePayer}>
          <Text style={globalStyles.primaryBtnText}>Confirmer le paiement (25€)</Text>
        </TouchableOpacity>

        <Text style={styles.secureText}>🛡️ Paiement sécurisé SSL 256-bit</Text> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 150 },
  summaryCard: { backgroundColor: Colors.surface, padding: 20, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: Colors.primary },
  summaryLabel: { color: Colors.textMuted, fontSize: 14 },
  summaryTotal: { color: Colors.textLight, fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { color: Colors.textMuted, fontSize: 14, fontWeight: 'bold', marginTop: 30, marginBottom: 15, textTransform: 'uppercase' },
  applePayBtn: { backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  applePayText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, paddingHorizontal: 15, fontSize: 12, fontWeight: 'bold' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { color: Colors.textLight, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: Colors.surface, color: Colors.textLight, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, fontSize: 16 },
  row: { flexDirection: 'row' },
  btnPay: { marginTop: 40 },
  secureText: { color: Colors.textMuted, textAlign: 'center', marginTop: 20, fontSize: 12 }
});

export default PaiementScreen;