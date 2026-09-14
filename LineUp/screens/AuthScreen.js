import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const AuthScreen = ({ changeScreen }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  
  // États partagés
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Nouveaux états exclusifs à l'inscription
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [telephone, setTelephone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 1. Fonction pour formater dynamiquement la date de naissance (Masque)
  const handleDateChange = (text) => {
    // Retire tout ce qui n'est pas un chiffre
    const cleaned = text.replace(/\D/g, '');
    
    // Applique le formatage avec les slashes
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4, 8)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    
    setDateNaissance(formatted); 
  };

  // 2. Fonction pour vérifier si la date saisie est une date réelle et cohérente
  const isValidDate = (dateString) => {
    // On vérifie qu'on a bien 10 caractères (8 chiffres + 2 slashes)
    if (dateString.length !== 10) return false;

    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Vérification du mois
    if (month < 1 || month > 12) return false;

    // Détermination du nombre de jours maximum dans ce mois (gère les années bissextiles)
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Vérification du jour
    if (day < 1 || day > daysInMonth) return false;

    // Vérification de l'année (doit être logique pour un utilisateur de l'app)
    const currentYear = new Date().getFullYear();
    // On bloque si l'année est avant 1900 ou dans le futur / pour un enfant de moins de 10 ans
    if (year < 1900 || year > currentYear - 10) return false; 

    return true;
  };

  const handleAuthentification = () => {
    if (!email.includes('@')) {
      Alert.alert("Format invalide", "Veuillez entrer une adresse e-mail valide (contenant un '@').");
      return;
    }

    if (isLogin) {
      if (email.trim() === '' || password === '') {
        Alert.alert("Erreur", "Veuillez remplir tous les champs.");
        return;
      }
    } else {
      // Vérification que tous les champs sont remplis
      if (
        nom.trim() === '' || 
        prenom.trim() === '' || 
        dateNaissance.trim() === '' || 
        telephone.trim() === '' || 
        email.trim() === '' || 
        password === '' || 
        confirmPassword === ''
      ) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs pour créer votre compte.");
        return;
      }

      // 3. Appel de la vérification de la date de naissance
      if (!isValidDate(dateNaissance)) {
        Alert.alert("Date invalide", "Veuillez entrer une date de naissance valide au format JJ/MM/AAAA.");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Erreur de mot de passe", "Les mots de passe ne correspondent pas. Veuillez vérifier votre saisie.");
        return;
      }
    }
    
    console.log(`Tentative de ${isLogin ? 'Connexion' : 'Création de compte'} avec :`, email);
    changeScreen('Home'); 
  };

  const handleResetPassword = () => {
    if (email.trim() === '') {
      Alert.alert("Erreur", "Veuillez entrer votre adresse e-mail pour recevoir le lien.");
      return;
    }
    if (!email.includes('@')) {
      Alert.alert("Format invalide", "Veuillez entrer une adresse e-mail valide.");
      return;
    }

    Alert.alert(
      "E-mail envoyé ! 📧", 
      `Si un compte est associé à l'adresse ${email}, un lien de réinitialisation vient de vous être envoyé.`,
      [{ text: "OK", onPress: () => setIsResetMode(false) }]
    );
  };

  const basculerMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Logo et Titre */}
          <View style={styles.header}>
            <Image source={require('../assets/LineUpLogo.jpg')} style={styles.logo} />
            <Text style={styles.subtitle}>
              {isResetMode 
                ? 'Récupération du compte'
                : isLogin ? 'Content de vous revoir!' : 'Rejoignez le pit !'}
            </Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            
            {/* CHAMPS EXCLUSIFS À L'INSCRIPTION */}
            {!isLogin && !isResetMode && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Prénom</Text>
                  <TextInput style={styles.input} placeholder="John" placeholderTextColor={Colors.textMuted} value={prenom} onChangeText={setPrenom} />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nom</Text>
                  <TextInput style={styles.input} placeholder="Doe" placeholderTextColor={Colors.textMuted} value={nom} onChangeText={setNom} />
                </View>

                {/* 4. Mise à jour de l'input de date de naissance */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date de naissance</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="JJ/MM/AAAA" 
                    placeholderTextColor={Colors.textMuted} 
                    keyboardType="numeric" 
                    maxLength={10} // 8 chiffres + 2 slashes max
                    value={dateNaissance} 
                    onChangeText={handleDateChange} // On utilise la fonction de masque
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Numéro de téléphone</Text>
                  <TextInput style={styles.input} placeholder="Ex: 06 12 34 56 78" placeholderTextColor={Colors.textMuted} keyboardType="phone-pad" value={telephone} onChangeText={setTelephone} />
                </View>
              </>
            )}

            {/* CHAMPS COMMUNS */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse e-mail</Text>
              <TextInput 
                style={styles.input}
                placeholder="festivalier@email.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* MOT DE PASSE */}
            {!isResetMode && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            )}

            {/* CONFIRMATION MOT DE PASSE */}
            {!isLogin && !isResetMode && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={true}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            )}

            {/* Lien "Mot de passe oublié" */}
            {isLogin && !isResetMode && (
              <TouchableOpacity onPress={() => setIsResetMode(true)}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            {/* Bouton d'action principal dynamique */}
            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={isResetMode ? handleResetPassword : handleAuthentification}
            >
              <Text style={styles.submitBtnText}>
                {isResetMode ? 'Envoyer le lien' : isLogin ? 'Se connecter' : "Créer mon compte"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bascule Connexion / Inscription / Retour */}
          <View style={styles.switchModeContainer}>
            {isResetMode ? (
              <TouchableOpacity onPress={() => setIsResetMode(false)}>
                <Text style={styles.switchBtnText}>← Retour à la connexion</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.switchText}>
                  {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                </Text>
                <TouchableOpacity onPress={basculerMode}>
                  <Text style={styles.switchBtnText}>
                    {isLogin ? " S'inscrire" : " Se connecter"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 30,
    paddingVertical: 40 
  },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 200, height: 200 }, 
  subtitle: { color: Colors.textDim, fontSize: 16, marginTop: 5 },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { color: Colors.textLight, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { 
    backgroundColor: Colors.surface,
    color: Colors.textLight,
    paddingHorizontal: 15, 
    paddingVertical: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: Colors.border,
    fontSize: 16 
  },
  forgotPasswordText: { 
    color: Colors.textMuted,
    textAlign: 'right', 
    fontSize: 14, 
    marginTop: -10, 
    marginBottom: 20, 
    textDecorationLine: 'underline' 
  },
  submitBtn: { 
    backgroundColor: Colors.primary,
    paddingVertical: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10, 
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 5 
  },
  submitBtnText: { 
    color: Colors.background,
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  switchModeContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  switchText: { color: Colors.textMuted, fontSize: 14 },
  switchBtnText: { color: Colors.primary, fontSize: 14, fontWeight: 'bold' },
});

export default AuthScreen;