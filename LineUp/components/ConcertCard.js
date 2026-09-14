import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/GlobalStyles';

const ConcertCard = ({ concert, onPress }) => {
  return (
    <TouchableOpacity style={styles.concertCard} onPress={onPress}>
      
      <View style={styles.concertTimeBlock}>
        <Text style={styles.concertTime}>{concert.heure}</Text>
      </View>
      
      <View style={styles.concertInfoBlock}>
        <Text style={styles.concertArtiste}>{concert.artiste}</Text>
        <Text style={styles.concertScene}>📍 {concert.scene}</Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  concertCard: { 
    flexDirection: 'row', 
    backgroundColor: Colors.surface,
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  concertTimeBlock: { 
    backgroundColor: Colors.primary,
    paddingVertical: 20, 
    paddingHorizontal: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 80 
  },
  concertTime: { 
    color: Colors.background,
    fontWeight: '900', 
    fontSize: 16 
  },
  concertInfoBlock: { 
    padding: 15, 
    justifyContent: 'center', 
    flex: 1 
  },
  concertArtiste: { 
    color: Colors.textLight,
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  concertScene: { 
    color: Colors.textMuted,
    fontSize: 14 
  }
});

export default ConcertCard;