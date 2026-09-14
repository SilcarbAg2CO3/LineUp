import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Plus, LogOut, Music, Trash2, AlertOctagon, User } from 'lucide-react';
import api from '../services/api'; // <-- Import de ton API

const Calendrier = () => {
  const { festivalId } = useParams();

  // Plan B (Fallback en cas d'erreur de l'API)
  const baseDeDonnees = {
    'summerside-2026': [
      { id: 1, jour: "Vendredi", heure: "08:30", titre: "Briefing Sécurité Général", lieu: "QG Staff", type: "Sécurité", importance: "Haute" },
      { id: 5, jour: "Vendredi", heure: "16:00", titre: "The Lathums", lieu: "Indie Stage", type: "Concert", importance: "Normale" },
      { id: 9, jour: "Vendredi", heure: "22:00", titre: "Dua Lipa", lieu: "Main Stage", type: "Concert", importance: "Haute" },
      { id: 19, jour: "Samedi", heure: "23:30", titre: "Arctic Monkeys", lieu: "Main Stage", type: "Concert", importance: "Urgente" },
      { id: 25, jour: "Dimanche", heure: "21:30", titre: "Gorillaz", lieu: "Main Stage", type: "Concert", importance: "Haute" }
    ],
    'hellfest-2026': [
      { id: 101, jour: "Vendredi", heure: "07:00", titre: "Arrivée des semi-remorques (Fûts)", lieu: "Zone Logistique", type: "Logistique", importance: "Haute" },
      { id: 103, jour: "Vendredi", heure: "20:00", titre: "Gojira", lieu: "Main Stage 1", type: "Concert", importance: "Haute" }
    ]
  };

  const [evenements, setEvenements] = useState([]); // Initialisation à vide
  const joursDisponibles = ['Vendredi', 'Samedi', 'Dimanche'];
  
  // --- NOS DEUX FILTRES ---
  const [jourActif, setJourActif] = useState(joursDisponibles[0]);
  const [categorieActive, setCategorieActive] = useState('Toutes'); 

  const [showModal, setShowModal] = useState(false);
  const [isEdition, setIsEdition] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, jour: 'Vendredi', heure: '', titre: '', lieu: '', type: 'Réunion', importance: 'Normale' 
  });

  // --- 1. LECTURE (GET) ---
  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await api.get(`/admin/festivals/${festivalId}/evenements`);
        setEvenements(response.data);
      } catch (error) {
        console.error("Erreur API (Chargement du calendrier) :", error);
        // Activation du Plan B
        setEvenements(baseDeDonnees[festivalId] || []);
      }
    };

    setJourActif(joursDisponibles[0]);
    setCategorieActive('Toutes');
    fetchEvenements();
  }, [festivalId]);

  // filtre multiple
  const evenementsFiltres = evenements
    .filter(e => e.jour === jourActif) // 1. On filtre par jour
    .filter(e => categorieActive === 'Toutes' || e.type === categorieActive) // 2. On filtre par catégorie
    .sort((a, b) => a.heure.localeCompare(b.heure)); // 3. On trie par heure

  const getEventStyle = (type) => {
    switch(type) {
      case 'Concert': return { color: 'var(--primary)', bg: 'rgba(249, 140, 47, 0.1)', icon: '🎸' };
      case 'Logistique': return { color: 'var(--success)', bg: 'rgba(76, 175, 80, 0.1)', icon: '📦' };
      case 'Réunion': return { color: 'var(--info)', bg: 'rgba(33, 150, 243, 0.1)', icon: '👥' };
      case 'Sécurité': return { color: 'var(--danger)', bg: 'rgba(244, 67, 54, 0.1)', icon: '🛡️' };
      default: return { color: 'var(--dark)', bg: 'var(--border)', icon: '📌' };
    }
  };

  const getImportanceStyle = (importance) => {
    switch(importance) {
      case 'Urgente': return { color: '#FFF', bg: 'var(--danger)' };
      case 'Haute': return { color: '#FFF', bg: 'var(--primary)' };
      case 'Normale': return { color: 'var(--text-dark)', bg: 'var(--border)' };
      case 'Basse': return { color: 'var(--text-dark)', bg: 'rgba(0,0,0,0.05)' };
      default: return { color: 'var(--text-muted)', bg: 'transparent' };
    }
  };

  const handleAjouter = () => {
    setFormData({ id: null, jour: jourActif, heure: '12:00', titre: '', lieu: '', type: 'Réunion', importance: 'Normale' });
    setIsEdition(false);
    setShowModal(true);
  };

  const handleEditer = (evenement) => {
    setFormData(evenement);
    setIsEdition(true);
    setShowModal(true);
  };

  // --- 2. SUPPRESSION (DELETE) ---
  const handleSupprimer = async (id, titre) => {
    if (window.confirm(`Êtes-vous sûr de vouloir annuler l'événement "${titre}" ?`)) {
      try {
        await api.delete(`/admin/evenements/${id}`);
        setEvenements(evenements.filter(e => e.id !== id));
      } catch (error) {
        console.error("Erreur API (Suppression) :", error);
        // Fallback visuel
        setEvenements(evenements.filter(e => e.id !== id));
      }
    }
  };

  // --- 3. SAUVEGARDE (POST & PUT) ---
  const handleSauvegarder = async (e) => {
    e.preventDefault();
    try {
      if (isEdition) {
        await api.put(`/admin/evenements/${formData.id}`, formData);
        setEvenements(evenements.map(e => e.id === formData.id ? formData : e));
      } else {
        const response = await api.post(`/admin/festivals/${festivalId}/evenements`, formData);
        setEvenements([...evenements, response.data]); // On utilise l'objet renvoyé par Laravel avec son vrai ID
      }
      setShowModal(false);
    } catch (error) {
      console.error("Erreur API (Sauvegarde) :", error);
      // Fallback visuel
      if (isEdition) {
        setEvenements(evenements.map(e => e.id === formData.id ? formData : e));
      } else {
        const nouvelEvent = { ...formData, id: Date.now() };
        setEvenements([...evenements, nouvelEvent]);
      }
      setShowModal(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title">Planning & Opérations</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Suivez le déroulement de la journée et gérez les urgences.</p>
        </div>
        <button className="btn-primary" onClick={handleAjouter}>
          + Nouvel événement
        </button>
      </div>

      <div className="card-padded" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '5px', color: 'var(--dark)' }}>Filtrer :</span>
        
        <button
          onClick={() => setCategorieActive('Toutes')}
          style={{
            padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
            backgroundColor: categorieActive === 'Toutes' ? 'var(--dark)' : 'transparent',
            color: categorieActive === 'Toutes' ? 'white' : 'var(--text-muted)',
            border: `1px solid ${categorieActive === 'Toutes' ? 'var(--dark)' : 'var(--border)'}`,
            transition: 'all 0.2s ease'
          }}
        >
          Toutes
        </button>

        {['Concert', 'Logistique', 'Réunion', 'Sécurité'].map(type => {
          const style = getEventStyle(type);
          const isSelected = categorieActive === type;
          
          return (
            <button
              key={type}
              onClick={() => setCategorieActive(type)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
                backgroundColor: isSelected ? style.bg : 'transparent',
                color: isSelected ? style.color : 'var(--text-muted)',
                border: `1px solid ${isSelected ? style.color : 'var(--border)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <span>{style.icon}</span> {type}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {joursDisponibles.map(jour => (
          <button 
            key={jour}
            onClick={() => setJourActif(jour)}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '20px', 
              backgroundColor: jourActif === jour ? 'var(--primary)' : 'transparent',
              color: jourActif === jour ? 'white' : 'var(--text-muted)',
              border: jourActif === jour ? '1px solid var(--primary)' : '1px solid var(--border)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {jour}
          </button>
        ))}
      </div>

      <div className="card-padded">
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: 'var(--dark)' }}>
            Programme du {jourActif} {categorieActive !== 'Toutes' && <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>({categorieActive})</span>}
          </h2>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            {evenementsFiltres.length} événement(s)
          </span>
        </div>
        
        {evenementsFiltres.length > 0 ? (
          evenementsFiltres.map((event) => {
            const styleType = getEventStyle(event.type);
            const styleImportance = getImportanceStyle(event.importance);
            
            return (
              <div key={event.id} style={{ 
                display: 'flex', 
                alignItems: 'stretch',
                marginBottom: '15px', 
                backgroundColor: styleType.bg, 
                padding: '15px', 
                borderRadius: '8px',
                borderLeft: `5px solid ${styleType.color}`,
                boxShadow: event.importance === 'Urgente' ? '0 0 10px rgba(244, 67, 54, 0.3)' : 'none',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{ width: '80px', paddingTop: '5px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--dark)' }}>{event.heure}</span>
                </div>
                
                <div style={{ flex: 1, paddingLeft: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{styleType.icon}</span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--dark)' }}>{event.titre}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn-info" 
                        onClick={() => handleEditer(event)}
                        style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        ✏️ Éditer
                      </button>
                      <button 
                        className="btn-danger" 
                        onClick={() => handleSupprimer(event.id, event.titre)}
                        style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        🗑️ Suppr.
                      </button>
                    </div>

                  </div>
                  
                  <div style={{ display: 'flex', gap: '15px', marginTop: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      📍 {event.lieu}
                    </span>
                    
                    <span style={{ 
                      fontSize: '12px', fontWeight: 'bold', color: styleType.color, 
                      backgroundColor: 'white', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${styleType.color}` 
                    }}>
                      {event.type}
                    </span>

                    <span style={{ 
                      fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                      color: styleImportance.color, backgroundColor: styleImportance.bg, 
                      padding: '3px 8px', borderRadius: '4px' 
                    }}>
                      {event.importance === 'Urgente' ? '🚨 Urgente' : event.importance}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', margin: 0 }}>
              Aucune opération "{categorieActive}" n'est planifiée pour le {jourActif}.
            </p>
          </div>
        )}
      </div>

      {/* --- MODALE D'ÉDITION / AJOUT --- */}
      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div className="card-padded" style={{ width: '500px', backgroundColor: 'var(--surface)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--dark)' }}>
              {isEdition ? "Modifier l'événement" : "Nouvel événement"}
            </h2>
            
            <form onSubmit={handleSauvegarder}>
              <div style={{ marginBottom: '15px' }}>
                <label className="form-label">Titre de l'événement</label>
                <input 
                  type="text" className="form-input" 
                  value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  placeholder="Ex: Briefing Staff, Livraison..." required
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Jour</label>
                  <select 
                    className="form-input"
                    value={formData.jour} onChange={(e) => setFormData({...formData, jour: e.target.value})}
                  >
                    <option value="Vendredi">Vendredi</option>
                    <option value="Samedi">Samedi</option>
                    <option value="Dimanche">Dimanche</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Heure</label>
                  <input 
                    type="time" className="form-input" 
                    value={formData.heure} onChange={(e) => setFormData({...formData, heure: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="form-label">Lieu</label>
                <input 
                  type="text" className="form-input" 
                  value={formData.lieu} onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                  placeholder="Ex: Main Stage, Entrée Nord..." required
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Catégorie</label>
                  <select 
                    className="form-input"
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Concert">🎸 Concert</option>
                    <option value="Logistique">📦 Logistique</option>
                    <option value="Réunion">👥 Réunion</option>
                    <option value="Sécurité">🛡️ Sécurité</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Importance</label>
                  <select 
                    className="form-input"
                    value={formData.importance} onChange={(e) => setFormData({...formData, importance: e.target.value})}
                  >
                    <option value="Basse">Basse</option>
                    <option value="Normale">Normale</option>
                    <option value="Haute">Haute</option>
                    <option value="Urgente">🚨 Urgente</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  💾 Sauvegarder
                </button>
                <button 
                  type="button" onClick={() => setShowModal(false)} 
                  style={{ padding: '10px', cursor: 'pointer', background: 'none', border: '1px solid var(--border)', borderRadius: '5px', color: 'var(--text-muted)' }}
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

export default Calendrier;