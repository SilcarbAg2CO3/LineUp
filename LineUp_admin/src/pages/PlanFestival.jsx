import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Tent, Beer, Utensils, Plus, Store, Navigation, Edit2, Trash2, Check, X } from 'lucide-react';
import api from '../services/api'; 

const PlanFestival = () => {
  const { festivalId } = useParams();
  const mapRef = useRef(null);
  
  const [filtreActif, setFiltreActif] = useState('Tous');
  const [pointSurvole, setPointSurvole] = useState(null);
  const [points, setPoints] = useState([]);
  
  const [modeEdition, setModeEdition] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pointActif, setPointActif] = useState(null);

  const categories = [
    { id: 'Tous', label: 'Tout afficher', color: 'var(--dark)' },
    { id: 'Scene', label: 'Scènes', color: 'var(--primary)', icon: <Tent size={16} /> },
    { id: 'Bar', label: 'Bars & Soif', color: 'var(--info)', icon: <Beer size={16} /> },
    { id: 'Food', label: 'Restauration', color: '#FF9800', icon: <Utensils size={16} /> },
    { id: 'Secours', label: 'Poste de Secours', color: 'var(--danger)', icon: <Plus size={16} /> },
    { id: 'Merch', label: 'Boutique / Merch', color: '#9C27B0', icon: <Store size={16} /> },
    { id: 'Acces', label: 'Entrées / Sorties', color: 'var(--success)', icon: <Navigation size={16} /> }
  ];

  // Plan B mis à jour avec pos_x et pos_y
  const donneesInitiales = {
    'summerside-2026': [
      { id: 1, type: 'Scene', nom: 'Main Stage', pos_x: 50, pos_y: 15 },
      { id: 4, type: 'Bar', nom: 'Bar Central', pos_x: 50, pos_y: 50 },
    ],
  };

  // Nouveaux états
const [planUrl, setPlanUrl] = useState(null);
const fileInputRef = useRef(null);

// Fonction pour envoyer l'image à Laravel
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post(`/admin/festivals/${festivalId}/plan`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setPlanUrl(response.data.url);
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
  }
};

  useEffect(() => {
  const fetchData = async () => {
    try {
      // On lance les deux requêtes en même temps
      const [lieuxResponse, festivalResponse] = await Promise.all([
        api.get(`/admin/festivals/${festivalId}/lieux`),
        api.get(`/admin/festivals/${festivalId}`) // Route pour récupérer les infos du festival
      ]);

      setPoints(lieuxResponse.data);
      setPlanUrl(festivalResponse.data.plan_image); // Ici ça fonctionnera !
      
    } catch (error) {
      console.error("Erreur API (Chargement des données) :", error);
      setPoints(donneesInitiales[festivalId] || []);
    }
  };

  fetchData();
  setFiltreActif('Tous');
  setModeEdition(false);
}, [festivalId]); // <-- N'oublie pas cette ligne pour fermer le useEffect

  const pointsFiltres = filtreActif === 'Tous' ? points : points.filter(p => p.type === filtreActif);

  const getConfigType = (typeId) => categories.find(c => c.id === typeId) || categories[0];

  const handleMapClick = (e) => {
    if (!modeEdition) return;

    const rect = mapRef.current.getBoundingClientRect();
    const pos_x = ((e.clientX - rect.left) / rect.width) * 100;
    const pos_y = ((e.clientY - rect.top) / rect.height) * 100;

    if (pointActif && showModal) {
      setPointActif({ ...pointActif, pos_x, pos_y });
    } else {
      setPointActif({ id: Date.now(), type: 'Scene', nom: 'Nouveau point', pos_x, pos_y, nouveau: true });
      setShowModal(true);
    }
  };

  const handlePointClick = (e, point) => {
    if (!modeEdition) return;
    e.stopPropagation();
    setPointActif({ ...point });
    setShowModal(true);
  };

  const sauvegarderPoint = async (e) => {
    e.preventDefault();
    try {
      if (pointActif.nouveau) {
        const { nouveau, ...pointASauvegarder } = pointActif;
        const response = await api.post(`/admin/festivals/${festivalId}/lieux`, pointASauvegarder);
        setPoints([...points, response.data]);
      } else {
        await api.put(`/admin/lieux/${pointActif.id}`, pointActif);
        setPoints(points.map(p => p.id === pointActif.id ? pointActif : p));
      }
      setShowModal(false);
      setPointActif(null);
    } catch (error) {
      console.error("Erreur API (Sauvegarde) :", error);
    }
  };

  const supprimerPoint = async () => {
    if (window.confirm(`Supprimer le point "${pointActif.nom}" ?`)) {
      try {
        await api.delete(`/admin/lieux/${pointActif.id}`);
        setPoints(points.filter(p => p.id !== pointActif.id));
        setShowModal(false);
        setPointActif(null);
      } catch (error) {
        console.error("Erreur API (Suppression) :", error);
      }
    }
  };

  const annulerEdition = () => {
    setShowModal(false);
    setPointActif(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title">Plan du Site & Régie</h1>
          <p className="page-subtitle">Visualisez et gérez l'emplacement des infrastructures du festival.</p>
        </div>
        
        <button 
          onClick={() => { setModeEdition(!modeEdition); setShowModal(false); setPointActif(null); }}
          className={modeEdition ? "btn-danger" : "btn-primary"}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {modeEdition ? <><Check size={18} /> Quitter l'édition</> : <><Edit2 size={18} /> Activer l'édition</>}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        <div 
          className="card" 
          ref={mapRef}
          onClick={handleMapClick}
          style={{ 
            flex: 1, position: 'relative', backgroundColor: '#e2e8f0', overflow: 'hidden',
            border: modeEdition ? '3px dashed var(--primary)' : '2px solid var(--border)',
            padding: 0, cursor: modeEdition ? (pointActif && showModal ? 'crosshair' : 'copy') : 'default'
          }}
        >
          {/* --- NOUVEAU : Bouton d'upload --- */}
          {modeEdition && (
            <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 50 }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <button 
                type="button"
                className="btn-info" 
                onClick={(e) => { 
                  e.stopPropagation(); // Empêche de créer un point en cliquant sur le bouton
                  fileInputRef.current.click(); 
                }}
                style={{ padding: '8px 15px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
              >
                📷 Changer le plan
              </button>
            </div>
          )}

          {/* --- NOUVEAU : Gestion de l'image dynamique --- */}
          {planUrl ? (
            <>
              <img 
                src={planUrl} 
                alt="Carte du festival" 
                style={{ width: '100%', height: 'auto', display: 'block', userSelect: 'none', pointerEvents: 'none', opacity: modeEdition ? 0.9 : 1 }} 
              />

              {/* Rendu des points existants */}
              {pointsFiltres.map((point) => {
                const config = getConfigType(point.type);
                if (pointActif && pointActif.id === point.id && !pointActif.nouveau) return null;
                const isHovered = pointSurvole === point.id;

                return (
                  <div 
                    key={point.id}
                    onMouseEnter={() => !modeEdition && setPointSurvole(point.id)}
                    onMouseLeave={() => setPointSurvole(null)}
                    onClick={(e) => handlePointClick(e, point)}
                    style={{
                      position: 'absolute', left: `${point.pos_x}%`, top: `${point.pos_y}%`, transform: 'translate(-50%, -50%)',
                      cursor: modeEdition ? 'pointer' : 'default', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', zIndex: isHovered || modeEdition ? 10 : 1, transition: 'transform 0.2s'
                    }}
                  >
                    <div style={{ 
                      backgroundColor: config.color, color: 'white', padding: '8px', borderRadius: '50%',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.5)', border: '2px solid white',
                      transform: (isHovered && !modeEdition) ? 'scale(1.2)' : 'scale(1)',
                      animation: modeEdition ? 'pulse 2s infinite' : 'none'
                    }}>
                      {config.icon || <MapPin size={16} />}
                    </div>
                    {(isHovered || modeEdition) && (
                      <div style={{
                        marginTop: '8px', padding: '4px 8px', backgroundColor: modeEdition ? 'rgba(0,0,0,0.7)' : 'var(--dark)',
                        color: 'white', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none'
                      }}>
                        {point.nom} {modeEdition && '✏️'}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Curseur de placement d'un nouveau point */}
              {pointActif && showModal && (
                 <div style={{
                  position: 'absolute', left: `${pointActif.pos_x}%`, top: `${pointActif.pos_y}%`, transform: 'translate(-50%, -50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 100, pointerEvents: 'none'
                }}>
                  <div style={{ 
                    backgroundColor: getConfigType(pointActif.type).color, color: 'white', padding: '8px', borderRadius: '50%',
                    boxShadow: '0 0 15px rgba(255,255,255,0.8)', border: '2px dashed white',
                  }}>
                    {getConfigType(pointActif.type).icon || <MapPin size={16} />}
                  </div>
                   <div style={{
                      marginTop: '8px', padding: '4px 8px', backgroundColor: 'var(--primary)',
                      color: 'white', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap'
                    }}>
                      Cliquez pour placer
                    </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Aucune image de plan disponible. Activez le mode édition pour en uploader une.
            </div>
          )}
        </div>

        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {modeEdition ? (
             <div className="card-padded" style={{ border: '2px solid var(--primary)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={20} /> Mode Édition Actif
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Cliquez sur la carte pour ajouter un point, ou cliquez sur un point existant pour le modifier.
              </p>

              {showModal && pointActif ? (
                <form onSubmit={sauvegarderPoint}>
                  <div style={{ marginBottom: '15px' }}>
                    <label className="form-label">Nom du point</label>
                    <input 
                      type="text" className="form-input" required autoFocus
                      value={pointActif.nom} 
                      onChange={(e) => setPointActif({...pointActif, nom: e.target.value})}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label">Catégorie</label>
                    <select 
                      className="form-input"
                      value={pointActif.type} 
                      onChange={(e) => setPointActif({...pointActif, type: e.target.value})}
                    >
                      {categories.filter(c => c.id !== 'Tous').map(cat => (
                         <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button type="submit" className="btn-primary">
                      💾 Enregistrer le point
                    </button>
                    
                    {!pointActif.nouveau && (
                      <button type="button" className="btn-danger" onClick={supprimerPoint} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                        <Trash2 size={16} /> Supprimer
                      </button>
                    )}

                    <button type="button" onClick={annulerEdition} style={{ padding: '10px', background: 'none', border: '1px solid var(--border)', borderRadius: '5px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--bg)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                    Sélectionnez ou créez un point sur la carte pour l'éditer ici.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="card-padded">
              <h3 style={{ margin: '0 0 15px 0', color: 'var(--dark)' }}>Légende & Filtres</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Cliquez sur une catégorie pour isoler les points d'intérêt sur la carte.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFiltreActif(cat.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px',
                      padding: '12px 15px', backgroundColor: filtreActif === cat.id ? `${cat.color}15` : 'transparent',
                      color: filtreActif === cat.id ? cat.color : 'var(--text-dark)',
                      border: `1px solid ${filtreActif === cat.id ? cat.color : 'var(--border)'}`,
                      borderRadius: '8px', cursor: 'pointer', fontWeight: filtreActif === cat.id ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ color: cat.color }}>
                      {cat.icon || <MapPin size={16} />}
                    </span>
                    {cat.label}
                    
                    {cat.id !== 'Tous' && (
                      <span style={{ 
                        marginLeft: 'auto', backgroundColor: filtreActif === cat.id ? cat.color : 'var(--border)', 
                        color: filtreActif === cat.id ? 'white' : 'var(--text-muted)',
                        padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                      }}>
                        {points.filter(p => p.type === cat.id).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanFestival;