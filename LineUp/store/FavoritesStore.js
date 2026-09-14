import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [mesFavoris, setMesFavoris] = useState([
    { id: 1, artiste: 'Arctic Monkeys', festival: 'Summerside 2026', dejaEvalue: true, commentaire: 'Concert mythique, le son était parfait près de la régie !' },
    { id: 5, artiste: 'Gojira', festival: 'Hellfest 2026', dejaEvalue: false, commentaire: '' },
  ]);

  const publierCommentaire = (idConcert, commentaire) => {
    setMesFavoris((prevFavoris) =>
      prevFavoris.map((concert) =>
        concert.id === idConcert
          ? { ...concert, dejaEvalue: true, commentaire }
          : concert
      )
    );
  };

  const ajouterFavori = (concert) => {
    setMesFavoris((prevFavoris) => [
      ...prevFavoris, 
      { ...concert, dejaEvalue: false, commentaire: '' }
    ]);
  };

  const retirerFavori = (idConcert) => {
    setMesFavoris((prevFavoris) => 
      prevFavoris.filter((c) => c.id !== idConcert)
    );
  };

  return (
    <FavoritesContext.Provider value={{ mesFavoris, publierCommentaire, ajouterFavori, retirerFavori }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);