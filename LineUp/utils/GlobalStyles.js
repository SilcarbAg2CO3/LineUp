import { StyleSheet } from 'react-native';

export const Colors = {
  background: '#05061A', // Bleu nuit très sombre
  surface: '#1E1E1E',    // Gris sombre (pour les cartes, boutons)
  primary: '#F98C2F',    // Orange (couleur d'accentuation)
  textLight: '#FFF',     // Texte principal
  textMuted: '#888',     // Texte secondaire/indications
  textDim: '#CCC',       // Texte tertiaire
  border: '#333'         // Bordures subtiles
};

// 2.  Styles Récurrents
export const globalStyles = StyleSheet.create({
  
  // -- STRUCTURE DE BASE --
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  
  // -- HEADER DES FESTIVALS --
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    marginTop: 50, 
    marginBottom: 20 
  },
  backButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    backgroundColor: Colors.surface, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: Colors.primary 
  },
  backButtonText: { 
    color: Colors.primary, 
    fontWeight: 'bold' 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: Colors.textLight 
  },
  headerSpacer: { // La petite vue vide à droite pour centrer le titre
    width: 80 
  },

  // -- ÉTATS VIDES (Quand il n'y a pas de billets, de favoris...) --
  emptyMessage: { 
    color: Colors.textMuted, 
    textAlign: 'center', 
    fontSize: 16, 
    fontStyle: 'italic', 
    marginTop: 40,
    marginBottom: 20
  },

  // -- BOUTONS D'ACTION STANDARDS --
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});