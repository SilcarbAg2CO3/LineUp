import React, { useState } from 'react';
import { SafeAreaView, View, Text, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const ProfilScreen = ({ changeScreen }) => {
  // État pour savoir si on est en train de modifier le profil ou juste de le lire
  const [isEditing, setIsEditing] = useState(false);

  // Fausse base de données locale pour l'utilisateur
  const [userInfo, setUserInfo] = useState({
    nom: 'Ruata',
    prenom: 'Matthieu',
    dateNaissance: '12/05/1998', 
    email: 'festivalier@email.com',
    telephone: '06 12 34 56 78'
  });

  // Fonction pour mettre à jour un champ spécifique
  const handleChange = (champ, valeur) => {
    setUserInfo({ ...userInfo, [champ]: valeur });
  };

  // fonction pour gérer la déconnexion avec confirmation
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion", 
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Se déconnecter", 
          style: "destructive", 
          onPress: () => changeScreen('Login') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Home')}>
          <Text style={globalStyles.backButtonText}>←Accueil</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Mon Profil</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* --- SECTION INFOS --- */}
        <View style={styles.infoSection}>
          
          <View style={styles.infoCard}>
            <Text style={styles.label}>Prénom</Text>
            {isEditing ? (
              <TextInput style={styles.input} value={userInfo.prenom} onChangeText={(text) => handleChange('prenom', text)} />
            ) : (
              <Text style={styles.value}>{userInfo.prenom}</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Nom</Text>
            {isEditing ? (
              <TextInput style={styles.input} value={userInfo.nom} onChangeText={(text) => handleChange('nom', text)} />
            ) : (
              <Text style={styles.value}>{userInfo.nom}</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Date de naissance</Text>
            {isEditing ? (
              <TextInput 
                style={styles.input} 
                value={userInfo.dateNaissance} 
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric" 
                onChangeText={(text) => handleChange('dateNaissance', text)} 
              />
            ) : (
              <Text style={styles.value}>{userInfo.dateNaissance}</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Adresse e-mail</Text>
            {isEditing ? (
              <TextInput style={styles.input} value={userInfo.email} keyboardType="email-address" autoCapitalize="none" onChangeText={(text) => handleChange('email', text)} />
            ) : (
              <Text style={styles.value}>{userInfo.email}</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>N° de téléphone</Text>
            {isEditing ? (
              <TextInput style={styles.input} value={userInfo.telephone} keyboardType="phone-pad" onChangeText={(text) => handleChange('telephone', text)} />
            ) : (
              <Text style={styles.value}>{userInfo.telephone}</Text>
            )}
          </View>

          {/* Bouton pour basculer entre Edition et Lecture */}
          <TouchableOpacity 
            style={[styles.editBtn, isEditing && styles.saveBtn]} 
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={[styles.editBtnText, isEditing && styles.saveBtnText]}>
              {isEditing ? "💾 Enregistrer les modifications" : "✏️ Modifier profil"}
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.divider} />

        {/* --- SECTION ACTIONS --- */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={globalStyles.primaryBtn} onPress={() => changeScreen('AjouterBillet')}>
            <Text style={globalStyles.primaryBtnText}>🎟️ Ajouter un billet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.secondaryBtn} onPress={handleLogout}>
            <Text style={globalStyles.secondaryBtnText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  
  infoSection: { marginBottom: 20 },
  infoCard: { backgroundColor: Colors.surface, padding: 15, borderRadius: 8, marginBottom: 12 },
  label: { color: Colors.textMuted, fontSize: 14, marginBottom: 5 },
  value: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
  input: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: Colors.primary, paddingVertical: 5 },
  
  editBtn: { marginTop: 10, paddingVertical: 12, alignItems: 'center', borderRadius: 8, backgroundColor: Colors.border },
  saveBtn: { backgroundColor: Colors.primary },
  editBtnText: { color: Colors.textLight, fontSize: 16, fontWeight: 'bold' },
  saveBtnText: { color: Colors.background },

  divider: { height: 1, backgroundColor: Colors.surface, marginVertical: 20 },
  actionSection: { gap: 15 },
});

export default ProfilScreen;