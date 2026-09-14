import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Plus, LogOut, Music, Trash2, AlertOctagon, User } from 'lucide-react';
import api from '../services/api';

import logoLineUp from '../assets/LineUpLogoWhite.png';

const ChoixFestival = () => {
  const navigate = useNavigate();

  const [festivals, setFestivals] = useState([]);
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [nouveauFestival, setNouveauFestival] = useState({ nom: '', annee: new Date().getFullYear().toString(), lieu: '' });

  const [festivalASupprimer, setFestivalASupprimer] = useState(null);
  const [etapeSuppression, setEtapeSuppression] = useState(0); 
  const [compteARebours, setCompteARebours] = useState(10);

  const donneesDeSecours = [
    { id: 'summerside-2026', nom: 'Summerside', annee: '2026', statut: 'En préparation ⏳', lieu: 'Lyon, France', couleur: 'var(--primary)' },
    { id: 'hellfest-2026', nom: 'Hellfest Open Air', annee: '2026', statut: 'Actif 🔴', lieu: 'Clisson, France', couleur: 'var(--danger)' }
  ];

  // 1. LECTURE (GET)
  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await api.get('/admin/festivals');
        setFestivals(response.data);
      } catch (error) {
        setFestivals(donneesDeSecours);
      }
    };
    fetchFestivals();
  }, []);

  // 2. SUPPRESSION API À LA FIN DU COMPTE À REBOURS
  useEffect(() => {
    let interval;
    if (etapeSuppression === 2 && compteARebours > 0) {
      interval = setInterval(() => setCompteARebours(prev => prev - 1), 1000);
    } else if (etapeSuppression === 2 && compteARebours === 0) {
      const executerSuppression = async () => {
        try {
          await api.delete(`/admin/festivals/${festivalASupprimer.id}`);
        } catch (error) {
          console.error("Erreur API :", error);
        } finally {
          setFestivals(prev => prev.filter(f => f.id !== festivalASupprimer.id));
          setEtapeSuppression(0);
          setFestivalASupprimer(null);
        }
      };
      executerSuppression();
    }
    return () => clearInterval(interval);
  }, [etapeSuppression, compteARebours, festivalASupprimer]);

  const handleClicPoubelle = (e, festival) => {
    e.stopPropagation(); 
    setFestivalASupprimer(festival);
    setEtapeSuppression(1); 
  };

  const confirmerSuppression = () => {
    setCompteARebours(10);
    setEtapeSuppression(2); 
  };

  const annulerSuppression = () => {
    setEtapeSuppression(0); 
    setFestivalASupprimer(null);
  };

  // 3. CRÉATION (POST)
  const handleAjouter = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/admin/festivals', nouveauFestival);
    
    // ON SÉCURISE L'OBJET AVANT DE L'AJOUTER AU STATE
    const festivalCree = {
      ...response.data,
      statut: response.data.statut || 'En préparation ⏳',
      couleur: response.data.couleur || '#F98C2F',
      lieu: response.data.lieu || nouveauFestival.lieu // Au cas où l'API ne le renvoie pas
    };

    setFestivals([...festivals, festivalCree]);
    setShowModalAjout(false);
    setNouveauFestival({ nom: '', annee: new Date().getFullYear().toString(), lieu: '' });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    // Optionnel : afficher une alerte ici
  }
};

  // 4. DÉCONNEXION API (Révocation du Token Sanctum)
  const handleDeconnexion = async () => {
    try {
      await api.post('/admin/logout'); 
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('estConnecte');
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img 
            src={logoLineUp} alt="Logo LineUp Manager" 
            style={{ width: '60px', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
          />
          <div>
            <h1 className="page-title" style={{ fontSize: '32px', marginBottom: '5px', marginTop: 0 }}>Vos Festivals</h1>
            <p className="page-subtitle" style={{ margin: 0 }}>Sélectionnez un événement à administrer ou créez-en un nouveau.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/profil')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', transition: 'all 0.2s' }}
          >
            <User size={18} /> Mon Profil
          </button>
          
          <button 
            onClick={handleDeconnexion}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 'bold', transition: 'all 0.2s' }}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        <div 
          onClick={() => setShowModalAjout(true)}
          style={{ 
            backgroundColor: 'transparent', border: '2px dashed var(--border)', borderRadius: '12px', 
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
            minHeight: '200px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <Plus size={40} style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: 0 }}>Nouveau Festival</h3>
        </div>

        {festivals.map((fest) => (
          <div 
            key={fest.id}
            onClick={() => navigate(`/admin/${fest.id}`)}
            className="card"
            style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ height: '6px', backgroundColor: fest.couleur, width: '100%' }}></div>
            
            <button 
              onClick={(e) => handleClicPoubelle(e, fest)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Supprimer ce festival"
            >
              <Trash2 size={20} />
            </button>
            
            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'var(--bg)', padding: '12px', borderRadius: '12px', color: fest.couleur }}>
                  <Music size={24} />
                </div>
                <span style={{ 
                  fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px', marginRight: '30px',
                  backgroundColor: fest.statut.includes('Actif') ? 'rgba(244, 67, 54, 0.1)' : 'var(--bg)',
                  color: fest.statut.includes('Actif') ? 'var(--danger)' : 'var(--text-muted)'
                }}>
                  {fest.statut}
                </span>
              </div>
              
              <h2 style={{ margin: '0 0 5px 0', color: 'var(--dark)' }}>{fest.nom}</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <Calendar size={16} /> Édition {fest.annee}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <MapPin size={16} /> {fest.lieu}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODALES --- */}
      {showModalAjout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card-padded" style={{ width: '400px', backgroundColor: 'var(--surface)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--dark)' }}>Créer un nouveau festival</h2>
            <form onSubmit={handleAjouter}>
              <div style={{ marginBottom: '15px' }}>
                <label className="form-label">Nom du festival</label>
                <input type="text" className="form-input" required value={nouveauFestival.nom} onChange={(e) => setNouveauFestival({...nouveauFestival, nom: e.target.value})} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label className="form-label">Année</label>
                <input type="number" className="form-input" required value={nouveauFestival.annee} onChange={(e) => setNouveauFestival({...nouveauFestival, annee: e.target.value})} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label className="form-label">Lieu (Ville, Pays)</label>
                <input type="text" className="form-input" required value={nouveauFestival.lieu} onChange={(e) => setNouveauFestival({...nouveauFestival, lieu: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Générer le projet</button>
                <button type="button" onClick={() => setShowModalAjout(false)} style={{ padding: '10px', cursor: 'pointer', background: 'none', border: '1px solid var(--border)', borderRadius: '5px', color: 'var(--text-muted)' }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {etapeSuppression === 1 && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card-padded" style={{ width: '450px', backgroundColor: 'var(--surface)', textAlign: 'center' }}>
            <AlertOctagon size={50} color="var(--danger)" style={{ margin: '0 auto 15px auto' }} />
            <h2 style={{ marginTop: 0, color: 'var(--dark)' }}>Suppression irréversible</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>
              Êtes-vous absolument sûr de vouloir supprimer toutes les données du festival <strong>{festivalASupprimer?.nom} {festivalASupprimer?.annee}</strong> ? Cette action est définitive.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={annulerSuppression} style={{ flex: 1, padding: '12px', cursor: 'pointer', background: 'none', border: '1px solid var(--border)', borderRadius: '5px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Annuler</button>
              <button onClick={confirmerSuppression} className="btn-danger" style={{ flex: 1, padding: '12px' }}>Oui, supprimer</button>
            </div>
          </div>
        </div>
      )}

      {etapeSuppression === 2 && (
        <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--dark)', color: 'white', padding: '15px 25px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 1000, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>Suppression de {festivalASupprimer?.nom}...</span>
            <span style={{ color: 'var(--danger)', marginLeft: '10px', fontWeight: 'bold' }}>{compteARebours}s</span>
          </div>
          <button 
            onClick={annulerSuppression}
            style={{ backgroundColor: 'white', color: 'var(--dark)', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Annuler la suppression
          </button>
        </div>
      )}

    </div>
  );
};

export default ChoixFestival;