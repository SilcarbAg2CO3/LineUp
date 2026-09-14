const simulateNetworkLatency = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchConcerts = async () => {
  try {
    await simulateNetworkLatency();
    // Plus tard : return fetch('https://api.lineup.com/concerts').then(res => res.json());
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des concerts :", error);
    throw error;
  }
};

export const fetchUserPasses = async (userId) => {
  try {
    await simulateNetworkLatency();
    // Plus tard : return fetch(`https://api.lineup.com/users/${userId}/passes`).then(res => res.json());
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des billets :", error);
    throw error;
  }
};

export const fetchMapData = async (festivalId) => {
  try {
    await simulateNetworkLatency();
    // Plus tard : return fetch(`https://api.lineup.com/festivals/${festivalId}/map`).then(res => res.json());
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la carte :", error);
    throw error;
  }
};

export const postReview = async (concertId, reviewData) => {
  try {
    await simulateNetworkLatency(800);
    /* Plus tard : 
    return fetch(`https://api.lineup.com/concerts/${concertId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    }).then(res => res.json());
    */
    return { success: true, message: "Avis publié avec succès." };
  } catch (error) {
    console.error("Erreur lors de la publication de l'avis :", error);
    throw error;
  }
};