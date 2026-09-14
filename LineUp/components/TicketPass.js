import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../utils/GlobalStyles';

const TicketPass = ({ festival, type, qrUrl, titulaire, commande, dates }) => {
  return (
    <View style={styles.ticketCard}>
      
      <View style={styles.ticketTop}>
        <Text style={styles.ticketFestival}>{festival}</Text>
        <Text style={styles.ticketType}>{type}</Text>
      </View>

      <View style={styles.ticketMiddle}>
        <View style={styles.qrContainer}>
 
          <Image source={require('../assets/qr_code_placeholder.png')} style={styles.qrImage} />

        </View>
        <Text style={styles.qrInstruction}>Présentez cet écran au contrôle</Text>
        <Text style={styles.qrBrightness}>💡 Pensez à augmenter votre luminosité</Text>
      </View>

      <View style={styles.ticketBottom}>
        <View style={styles.ticketInfoRow}>
          <Text style={styles.ticketLabel}>Titulaire</Text>
          <Text style={styles.ticketValue}>{titulaire}</Text>
        </View>
        <View style={styles.ticketInfoRow}>
          <Text style={styles.ticketLabel}>Numéro de commande</Text>
          <Text style={styles.ticketValue}>{commande}</Text>
        </View>
        <View style={styles.ticketInfoRow}>
          <Text style={styles.ticketLabel}>Dates valides</Text>
          <Text style={styles.ticketValue}>{dates}</Text>
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  ticketCard: { 
    backgroundColor: Colors.surface,
    width: '100%', 
    borderRadius: 16, 
    overflow: 'hidden', 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 10,
    marginBottom: 20,
  },
  ticketTop: { 
    backgroundColor: Colors.primary,
    padding: 20, 
    alignItems: 'center' 
  },
  ticketFestival: { 
    color: Colors.background,
    fontSize: 24, 
    fontWeight: '900', 
    letterSpacing: 1 
  },
  ticketType: { 
    color: Colors.background,
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 5 
  },
  ticketMiddle: { 
    padding: 30, 
    alignItems: 'center', 
    borderBottomWidth: 2, 
    borderBottomColor: Colors.background,
    borderStyle: 'dashed'
  },
  qrContainer: { 
    backgroundColor: '#FFF', // on laisse en dur (fond blanc pour rendre le code qr scannable)
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15 
  },
  qrImage: { 
    width: 200, 
    height: 200 
  },
  qrInstruction: { 
    color: Colors.textLight,
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 5
  },
  qrBrightness: {
    color: Colors.primary,
    fontSize: 12,
    fontStyle: 'italic'
  },
  ticketBottom: { 
    padding: 20, 
    backgroundColor: Colors.surface
  },
  ticketInfoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  ticketLabel: { 
    color: Colors.textMuted,
    fontSize: 14, 
    textTransform: 'uppercase' 
  },
  ticketValue: { 
    color: Colors.textLight,
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});

export default TicketPass;