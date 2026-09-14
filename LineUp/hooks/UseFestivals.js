import { useState, useMemo } from 'react';

/*
ce fichier agit comme un moteur de recherche intelligent.
il prend une base de données brute et en extrait uniquement ce qui intéresse l'utilisateur à un instant T.

baseDeDonneesConcerts : liste complète de tous les concerts (le gros catalogue).
festivalsDisponibles : liste des noms de festivals (ex: Summerside, Hellfest).
*/
const useFestivals = (baseDeDonneesConcerts, festivalsDisponibles) => {
  const [festivalChoisi, setFestivalChoisi] = useState(festivalsDisponibles[0]); //festivalChoisi : Le festival actif (par défaut, le premier de la liste)

  const concertsDuFestival = useMemo(() => { //useMemo permet de ne calculer les liste que si nécessaire (garde le premier résultat en mémoire et évite 10000000 calculs chaque ms)
    return baseDeDonneesConcerts.filter(c => c.festival === festivalChoisi);

    /*
    c représente un concert pendant que .filter() parcourt la liste un par un.
    On vérifie si l'attribut festival de ce concert précis est strictement égal (===) à festivalChoisi
    Si c'est VRAI, le concert est gardé dans la nouvelle liste. Si c'est FAUX, il est jeté.
    */

  }, 
  
  [baseDeDonneesConcerts, festivalChoisi]);

  const joursDynamiques = useMemo(() => {
    return [...new Set(concertsDuFestival.map(c => c.jour))];
    /*
      etape 1 : Isoler les jours avec .map()
      .map() prend la liste de tous les concerts du festival avec ses infos et ne conserve que l'attribut jour.
      on obtient un tableau rempli de doublons, car plusieurs concerts ont lieu le même jour.
      
      etape 2 : Supprimer les doublons avec new Set()
      un Set est une structure de données spéciale qui ne permet pas de stocker deux fois la même valeur.
      En lui donnant notre tableau plein de doublons de l'étape 1, le Set va automatiquement le nettoyer. 

      etape 3 : Re-transformer en tableau avec [...]
      "..." = le Spread Operator (Opérateur de décomposition).
      "[ ]" crée un nouveau tableau vide.
      Les ... prennent le contenu propre de notre Set et le "versent" dans ce nouveau tableau.
      résultat final : ['Vendredi', 'Samedi'] (Un tableau prêt à être affiché).

      useMemo(): mémorise le résultat
    */


  }, [concertsDuFestival]);

  const scenesDynamiques = useMemo(() => {
    return ['Toutes', ...new Set(concertsDuFestival.map(c => c.scene))];
/*
etape supplémentaire : Créer le tableau final en injectant 'Toutes'
On ouvre un nouveau tableau avec les crochets [ ].
En premier élément, on hard code la chaîne de caractères 'Toutes'.
Ensuite, on met une virgule, et on utilise le Spread Operator (...) pour "verser" le reste de nos scènes uniques juste à la suite.
Résultat final : ['Toutes', 'Main Stage', 'Chapiteau', 'Main Stage 2']
*/

  }, [concertsDuFestival]);


  const [jourChoisi, setJourChoisi] = useState(joursDynamiques[0] || ''); //jourChoisi : Le jour sélectionné (Vendredi, Samedi, etc)
  const [sceneChoisie, setSceneChoisie] = useState('Toutes'); //sceneChoisie : La scène sélectionnée (ou "Toutes").

  const changerDeFestival = (nouveauFestival) => {
    setFestivalChoisi(nouveauFestival);

    /* met à jour le nom du festival.
      réinitialise automatiquement le jour (sur le premier jour du nouveau festival).
      réinitialise la scène sur "Toutes".
      ca évite de se retrouver avec des filtres impossibles (ex: chercher une scène du Hellfest alors qu'on est sur Summerside).
    */
    
    const concertsNouveau = baseDeDonneesConcerts.filter(c => c.festival === nouveauFestival);
    const premierJourNouveau = [...new Set(concertsNouveau.map(c => c.jour))][0];
    
    setJourChoisi(premierJourNouveau || '');
    setSceneChoisie('Toutes');
  };

  const concertsFiltres = useMemo(() => {
    return concertsDuFestival.filter((concert) => {
      const conditionJour = concert.jour === jourChoisi;
      const conditionScene = sceneChoisie === 'Toutes' || concert.scene === sceneChoisie;
      return conditionJour && conditionScene;
    });
  }, [concertsDuFestival, jourChoisi, sceneChoisie]);

  return {
//renvoie pour ProgrammationScreen les données à afficher, les listes pour créer les boutons et les fonctions pour interagir

    festivalChoisi,
    changerDeFestival,
    joursDynamiques,
    jourChoisi,
    setJourChoisi,
    scenesDynamiques,
    sceneChoisie,
    setSceneChoisie,
    concertsFiltres
  };
};

export default useFestivals;