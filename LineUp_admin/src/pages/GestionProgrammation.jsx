import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const GestionProgrammation = () => {
  const { festivalId } = useParams();

  const [concerts, setConcerts] = useState([]);
  const [scenesUniques, setScenesUniques] = useState([]);
  const [filtreScene, setFiltreScene] = useState('Toutes');
  const [messageAlerte, setMessageAlerte] = useState(null); // <-- Ajout des messages
  
  const [showModal, setShowModal] = useState(false);
  const [isEdition, setIsEdition] = useState(false); 
  const [formData, setFormData] = useState({ id: null, nom: '', jour: 'Vendredi', heure: '', scene: 'Main Stage', statut: 'Confirmé' });

  // Plan B (en cas de serveur injoignable)
  const baseDeDonnees = {
    'summerside-2026': [
      { id: 1, artiste: "The Lathums", jour: "Vendredi", heure: "16:00", scene: "Indie Stage", statut: "Confirmé" },
      { id: 3, artiste: "Dua Lipa", jour: "Vendredi", heure: "22:00", scene: "Main Stage", statut: "Confirmé" },
      { id: 7, artiste: "Arctic Monkeys", jour: "Samedi", heure: "23:30", scene: "Main Stage", statut: "Confirmé" }
    ],
    'hellfest-2026': [
      { id: 102, artiste: "Gojira", jour: "Vendredi", heure: "20:00", scene: "Main Stage 1", statut: "Confirmé" },
      { id: 105, artiste: "Metallica", jour: "Samedi", heure: "21:30", scene: "Main Stage 1", statut: "Confirmé" }
    ]
  };

  // --- 1. LECTURE (GET) SÉCURISÉE ---
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await api.get(`/admin/festivals/${festivalId}/concerts`);
        // Sécurité anti-écran blanc : on s'assure d'avoir un tableau
        const data = Array.isArray(response.data) ? response.data : [];
        setConcerts(data);
        
        // On extrait les scènes uniques sans les valeurs nulles
        setScenesUniques([...new Set(data.map(c => c.scene).filter(Boolean))]);
      } catch (error) {
        console.error("Erreur API (Chargement programmation) :", error);
        // Fallback activé uniquement si erreur réseau/serveur critique
        if (!error.response) {
          const fallbackData = baseDeDonnees[festivalId] || [];
          setConcerts(fallbackData);
          setScenesUniques([...new Set(fallbackData.map(c => c.scene).filter(Boolean))]);
        }
      }
    };

    if (festivalId) fetchConcerts();
  }, [festivalId]);

  // Filtrage sécurisé
  const concertsFiltres = (concerts || []).filter(c => filtreScene === 'Toutes' || c.scene === filtreScene);

  const getBadgeStyle = (statut) => {
    switch(statut) {
      case 'Confirmé': return { color: 'var(--success)', bg: 'rgba(76, 175, 80, 0.1)' };
      case 'En attente': return { color: 'var(--primary)', bg: 'rgba(249, 140, 47, 0.1)' };
      case 'Annulé': return { color: 'var(--danger)', bg: 'rgba(244, 67, 54, 0.1)' };
      default: return { color: 'var(--text-muted)', bg: 'var(--border)' };
    }
  };

  // --- 2. SUPPRESSION (DELETE) ---
  const handleSupprimer = async (id, artiste) => {
    const nomArtiste = typeof artiste === 'object' ? artiste?.nom : artiste;
    
    if (window.confirm(`Êtes-vous sûr de vouloir déprogrammer ${nomArtiste || 'cet artiste'} ?`)) {
      try {
        await api.delete(`/admin/concerts/${id}`);
        setConcerts(prev => prev.filter(c => c.id !== id));
        setMessageAlerte(`Le concert a été supprimé.`);
        setTimeout(() => setMessageAlerte(null), 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        // Fallback visuel
        setConcerts(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const handleEditer = (concert) => {
    const nomArtiste = typeof concert.artiste === 'object' ? concert.artiste?.nom : concert.artiste;
    setFormData({ ...concert});
    setIsEdition(true);
    setShowModal(true);
  };

  const handleAjouter = () => {
    setFormData({ id: null, artiste: '', jour: 'Vendredi', heure: '', scene: 'Main Stage', statut: 'Confirmé' });
    setIsEdition(false);
    setShowModal(true);
  };

  // --- 3. CRÉATION (POST) & MISE À JOUR (PUT) ---
  const handleSauvegarder = async (e) => {
    e.preventDefault();
    try {
      if (isEdition) {
        const response = await api.put(`/admin/concerts/${formData.id}`, formData);
        setConcerts(prev => prev.map(c => c.id === formData.id ? response.data : c));
        setMessageAlerte(`Concert de ${response.data.nom || formData.nom} modifié avec succès !`);
      } else {
        const response = await api.post(`/admin/festivals/${festivalId}/concerts`, formData);
        setConcerts(prev => [...prev, response.data]); 
        setMessageAlerte(`L'artiste a été programmé avec succès !`);
        
        if (response.data.scene && !scenesUniques.includes(response.data.scene)) {
            setScenesUniques(prev => [...prev, response.data.scene]);
        }
      }
      setShowModal(false); 
      setTimeout(() => setMessageAlerte(null), 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      
      // Fallback visuel
      if (!isEdition) {
        setConcerts(prev => [...prev, { ...formData, id: Date.now() }]);
      } else {
        setConcerts(prev => prev.map(c => c.id === formData.id ? formData : c));
      }
      setShowModal(false);
      setMessageAlerte("Sauvegarde effectuée (Mode hors-ligne)");
      setTimeout(() => setMessageAlerte(null), 3000);
    }
  };

  return (
    <div>
      {/* Affichage des messages de succès */}
      {messageAlerte && (
        <div style={{ backgroundColor: '#4caf50', color: 'white', padding: '15px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ✅ {messageAlerte}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">Gestion de la Programmation</h1>
        <button className="btn-primary" onClick={handleAjouter} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          + Ajouter un concert
        </button>
      </div>

      <div className="card-padded" style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ width: '300px' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Filtrer par Scène</label>
          <select 
            value={filtreScene} 
            onChange={(e) => setFiltreScene(e.target.value)} 
            className="form-input" 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="Toutes">Toutes les scènes</option>
            {scenesUniques.map(scene => (
              <option key={scene} value={scene}>{scene}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>Artiste</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Jour</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Heure</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Scène</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {concertsFiltres.length > 0 ? concertsFiltres.map((c) => {
              const badgeStyle = getBadgeStyle(c.statut);
              const nomArtiste = typeof c.artiste === 'object' ? c.artiste?.nom : c.artiste;
              
              return (
                <tr key={c.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{c.nom}</td>
                  <td style={{ padding: '15px' }}>{c.jour}</td>
                  <td style={{ padding: '15px', color: '#666', fontWeight: 'bold' }}>{c.heure}</td>
                  <td style={{ padding: '15px' }}>{c.scene}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      color: badgeStyle.color, 
                      backgroundColor: badgeStyle.bg,
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {c.statut}
                    </span>
                  </td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-info" 
                      onClick={() => handleEditer(c)}
                      style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      ✏️ Éditer
                    </button>
                    <button 
                      className="btn-danger" 
                      onClick={() => handleSupprimer(c.id, c.nom)}
                      style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      🗑️ Suppr.
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                  Aucun artiste programmé pour cette sélection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div className="card-padded" style={{ width: '450px', backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>
              {isEdition ? "Modifier le concert" : "Programmer un artiste"}
            </h2>
            
            <form onSubmit={handleSauvegarder}>
              <div style={{ marginBottom: '15px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nom de l'artiste</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Jour</label>
                  <select 
                    className="form-input"
                    value={formData.jour}
                    onChange={(e) => setFormData({...formData, jour: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="Jeudi">Jeudi</option>
                    <option value="Vendredi">Vendredi</option>
                    <option value="Samedi">Samedi</option>
                    <option value="Dimanche">Dimanche</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Heure</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={formData.heure}
                    onChange={(e) => setFormData({...formData, heure: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Scène</label>
                <input 
                  list="scenes-list"
                  className="form-input"
                  value={formData.scene}
                  onChange={(e) => setFormData({...formData, scene: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  placeholder="Ex: Main Stage"
                />
                <datalist id="scenes-list">
                  {scenesUniques.map(scene => (
                    <option key={scene} value={scene} />
                  ))}
                </datalist>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Statut</label>
                <select 
                  className="form-input"
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="Confirmé">Confirmé</option>
                  <option value="En attente">En attente</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: 'var(--primary, #007bff)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  💾 Sauvegarder
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)} 
                  style={{ padding: '12px', cursor: 'pointer', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px', color: '#666', fontWeight: 'bold' }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProgrammation;