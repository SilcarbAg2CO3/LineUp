import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import TicketPass from '../components/TicketPass';
import { globalStyles, Colors } from '../utils/GlobalStyles';

// Fausses données locales
const mesBillets = [
  {
    festival: 'Summerside 2026',
    type: 'PASS 3 JOURS - VIP',
    qrUrl: "./assets/qr_code_placeholder.png",
    titulaire: 'Matthieu Ruata',
    commande: '#CMD-84729',
    dates: '12, 13, 14 Juillet 2026',
    // 1. On simule que l'utilisateur a un casier pour ce festival
    servicesActifs: {
      casier: { taille: 'M', code: '482-A', zone: 'Entrée Principale' }
    }
  },
  {
    festival: 'Hellfest 2026',
    type: 'PASS COMPLET',
    qrUrl: "./assets/qr_code_placeholder.png",
    titulaire: 'Matthieu Ruata',
    commande: '#CMD-F7EVH53',
    dates: '10, 11, 12 Juin 2026',
    // Pas de casier réservé ici
    servicesActifs: null
  }
];

const BilletsScreen = ({ changeScreen, festival }) => {
  const monBillet = mesBillets.find(billet => billet.festival === festival);

  return (
    <SafeAreaView style={globalStyles.container}>
      
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Home')}>
          <Text style={globalStyles.backButtonText}>←Accueil</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>{festival}</Text>
        <View style={globalStyles.headerSpacer} /> 
      </View>

      <ScrollView contentContainerStyle={styles.ticketScroll}>
        {monBillet ? (
          <>
            <TicketPass 
              festival={monBillet.festival}
              type={monBillet.type}
              qrUrl={monBillet.qrUrl}
              titulaire={monBillet.titulaire}
              commande={monBillet.commande}
              dates={monBillet.dates}
            />

            {/* 2. Affichage conditionnel des services (comme le Casier) */}
            {monBillet.servicesActifs?.casier && (
              <View style={styles.servicesContainer}>
                <Text style={styles.servicesTitle}>Vos Services Actifs</Text>
                
                <View style={styles.serviceCard}>
                  <View style={styles.serviceIconContainer}>
                    <Text style={styles.serviceIcon}>🔐</Text>
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>Casier Taille {monBillet.servicesActifs.casier.taille}</Text>
                    <Text style={styles.serviceSubInfo}>📍 {monBillet.servicesActifs.casier.zone}</Text>
                  </View>
                  <View style={styles.serviceCodeBox}>
                    <Text style={styles.serviceCodeLabel}>CODE ACCÈS</Text>
                    <Text style={styles.serviceCode}>{monBillet.servicesActifs.casier.code}</Text>
                  </View>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={globalStyles.emptyMessage}>Vous n'avez pas encore de billet associé pour {festival}.</Text>
            
            <TouchableOpacity style={globalStyles.secondaryBtn} onPress={() => changeScreen('Profil')}>
              <Text style={globalStyles.secondaryBtnText}>Aller au profil pour l'ajouter</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ticketScroll: { 
    paddingHorizontal: 20, 
    paddingBottom: 150, // Laisse de la place pour la TabBar
    alignItems: 'center', 
    marginTop: 10 
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  servicesContainer: {
    width: '100%',
    marginTop: 10,
  },
  servicesTitle: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
  },
  serviceCard: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceIconContainer: {
    backgroundColor: 'rgba(249, 140, 47, 0.1)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceSubInfo: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  serviceCodeBox: {
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  serviceCodeLabel: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  serviceCode: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  }
});

export default BilletsScreen;