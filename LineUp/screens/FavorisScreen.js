import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { baseDeDonneesConcerts } from '../utils/MockData';
import { globalStyles, Colors } from '../utils/GlobalStyles';

const FavorisScreen = ({ changeScreen, festival }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mesEvaluations, setMesEvaluations] = useState([]);
  const [drafts, setDrafts] = useState({});

  const concertsFiltres = useMemo(() => {
    let concerts = baseDeDonneesConcerts.filter(c => c.festival === festival);
    if (searchQuery.trim() !== '') {
      concerts = concerts.filter(c => 
        c.artiste.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return concerts;
  }, [festival, searchQuery]);

  const handleStarPress = (idConcert, star) => {
    setDrafts(prev => ({ ...prev, [idConcert]: { ...prev[idConcert], note: star } }));
  };

  const handleTextChange = (idConcert, text) => {
    setDrafts(prev => ({ ...prev, [idConcert]: { ...prev[idConcert], commentaire: text } }));
  };

  const publierAvis = (idConcert) => {
    const draft = drafts[idConcert];
    if (!draft || !draft.note) {
      Alert.alert("Note manquante", "Veuillez sélectionner au moins une étoile pour évaluer ce concert.");
      return;
    }
    setMesEvaluations(prev => [...prev, { idConcert, note: draft.note, commentaire: draft.commentaire || '' }]);
  };

  const renderStars = (idConcert, currentRating = 0, isInteractive = true) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} disabled={!isInteractive} onPress={() => handleStarPress(idConcert, star)}>
            <Text style={[styles.starIcon, { color: star <= currentRating ? Colors.primary : Colors.border }]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      
      <View style={globalStyles.header}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => changeScreen('Home')}>
          <Text style={globalStyles.backButtonText}>←Accueil</Text>
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>{festival}</Text>
        <View style={globalStyles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Rechercher un artiste..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.reviewsScrollContainer}>
        <Text style={styles.reviewSubtitle}>
          Notez les concerts de {festival} auxquels vous avez assisté !
        </Text>

        {concertsFiltres.length > 0 ? (
          concertsFiltres.map((concert) => {
            const evaluation = mesEvaluations.find(e => e.idConcert === concert.id);
            const isEvaluated = !!evaluation;
            const draft = drafts[concert.id] || {};

            return (
              <View key={concert.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewArtiste}>{concert.artiste}</Text>
                  <Text style={styles.reviewScene}>{concert.jour} - {concert.scene} ({concert.heure})</Text>
                </View>

                {isEvaluated ? (
                  <View style={styles.commentBox}>
                    {renderStars(concert.id, evaluation.note, false)}
                    {evaluation.commentaire ? (
                      <Text style={styles.commentText}>"{evaluation.commentaire}"</Text>
                    ) : (
                      <Text style={styles.noCommentText}>Aucun commentaire laissé.</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.inputSection}>
                    <Text style={styles.instructionText}>Votre note :</Text>
                    {renderStars(concert.id, draft.note || 0, true)}
                    
                    <TextInput 
                      style={styles.textInput}
                      placeholder="Un mot sur ce concert ? (Optionnel)"
                      placeholderTextColor={Colors.textMuted}
                      multiline={true}
                      value={draft.commentaire || ''}
                      onChangeText={(texte) => handleTextChange(concert.id, texte)}
                    />
                    <TouchableOpacity style={globalStyles.primaryBtn} onPress={() => publierAvis(concert.id)}>
                      <Text style={globalStyles.primaryBtnText}>Publier mon avis</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <Text style={globalStyles.emptyMessage}>Aucun artiste trouvé pour cette recherche.</Text>
        )}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
  searchInput: { backgroundColor: Colors.surface, color: Colors.textLight, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, fontSize: 16 },
  reviewsScrollContainer: { 
    paddingHorizontal: 20, 
    paddingBottom: 100 
  },
  reviewSubtitle: { color: Colors.textMuted, fontSize: 14, fontStyle: 'italic', marginBottom: 20, textAlign: 'center' },
  reviewCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 20, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  reviewHeader: { marginBottom: 15 },
  reviewArtiste: { color: Colors.textLight, fontSize: 22, fontWeight: 'bold' },
  reviewScene: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },
  starsContainer: { flexDirection: 'row', marginBottom: 10 },
  starIcon: { fontSize: 28, marginRight: 5 },
  instructionText: { color: Colors.textMuted, fontSize: 14, marginBottom: 5 },
  commentBox: { backgroundColor: Colors.background, padding: 15, borderRadius: 8 },
  commentText: { color: Colors.textDim, fontSize: 15, fontStyle: 'italic', lineHeight: 22 },
  noCommentText: { color: Colors.textMuted, fontSize: 14, fontStyle: 'italic' },
  inputSection: { marginTop: 5 },
  textInput: { backgroundColor: Colors.background, color: Colors.textLight, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, minHeight: 80, textAlignVertical: 'top', marginBottom: 15 },
});

export default FavorisScreen;