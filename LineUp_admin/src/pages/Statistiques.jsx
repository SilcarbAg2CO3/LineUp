import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, X, Star } from 'lucide-react';
import api from '../services/api';

const Statistiques = () => {
  const { festivalId } = useParams();
  const [ongletActif, setOngletActif] = useState('performances');
  const [artisteSelectionne, setArtisteSelectionne] = useState(null);

  const [statsActuelles, setStatsActuelles] = useState({ 
    statut: "Chargement...", 
    totalAvis: "0", 
    noteGlobale: "-", 
    performances: [], 
    ventes: [] 
  });

  useEffect(() => {
    const fetchStatistiques = async () => {
      try {
        const response = await api.get(`/admin/festivals/${festivalId}/stats`);
        setStatsActuelles(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        // On affiche simplement une erreur si la BDD n'est pas joignable
        setStatsActuelles({ 
          statut: "Erreur de connexion", 
          totalAvis: "0", 
          noteGlobale: "-", 
          performances: [], 
          ventes: [] 
        });
      }
    };

    if (festivalId) fetchStatistiques();
  }, [festivalId]);

  const renderStars = (note) => {
    if (isNaN(parseFloat(note))) return <span style={{ color: 'var(--text-muted)' }}>À venir</span>;
    return "⭐".repeat(Math.round(parseFloat(note)));
  };

  const getBadgeStyle = (tendance) => {
    if (!tendance) return { color: 'var(--text-muted)', bg: 'var(--border)', icon: '' };
    
    if (tendance === 'Final' || tendance === 'À venir') {
      return { color: 'var(--text-muted)', bg: 'var(--border)', icon: tendance === 'Final' ? '🏁 ' : '⏳ ' };
    }
    if (tendance.includes('+')) {
      return { color: 'var(--success)', bg: 'rgba(76, 175, 80, 0.1)', icon: '↗ ' };
    }
    return { color: 'var(--danger)', bg: 'rgba(244, 67, 54, 0.1)', icon: '↘ ' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h1 className="page-title">Analyse des Données</h1>
        <span style={{ 
          backgroundColor: statsActuelles.statut.includes('préparation') ? 'rgba(249, 140, 47, 0.1)' : 
                           statsActuelles.statut.includes('Actif') ? 'rgba(244, 67, 54, 0.1)' : 'var(--border)', 
          color: statsActuelles.statut.includes('préparation') ? 'var(--primary)' : 
                 statsActuelles.statut.includes('Actif') ? 'var(--danger)' : 'var(--text-muted)', 
          padding: '8px 15px', 
          borderRadius: '20px', 
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {statsActuelles.statut}
        </span>
      </div>
      <p className="page-subtitle">Consultez les statistiques détaillées de votre événement.</p>

      {/* --- RÉSUMÉ GLOBAL --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div className="card-padded" style={{ flex: 1, backgroundColor: 'var(--dark)', color: 'white' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#AAA' }}>Total des avis festivaliers</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: 'var(--primary)' }}>
            {statsActuelles.totalAvis}
          </p>
        </div>
        <div className="card-padded" style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-muted)' }}>Note moyenne globale</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: statsActuelles.noteGlobale === '-' ? 'var(--text-muted)' : 'var(--success)' }}>
            {statsActuelles.noteGlobale !== '-' ? `${statsActuelles.noteGlobale} / 5` : 'N/A'}
          </p>
        </div>
      </div>

      {/* --- SOUS-NAVIGATION (Onglets) --- */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--border)' }}>
        <button 
          onClick={() => setOngletActif('performances')}
          style={{ 
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: ongletActif === 'performances' ? '3px solid var(--primary)' : '3px solid transparent',
            color: ongletActif === 'performances' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 'bold', fontSize: '16px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Star size={18} /> Avis Artistes
        </button>
        <button 
          onClick={() => setOngletActif('ventes')}
          style={{ 
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: ongletActif === 'ventes' ? '3px solid var(--primary)' : '3px solid transparent',
            color: ongletActif === 'ventes' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 'bold', fontSize: '16px', transition: 'all 0.2s'
          }}
        >
          💰 Ventes & Revenus
        </button>
      </div>

      {/* --- CONTENU DE L'ONGLET : PERFORMANCES --- */}
      {ongletActif === 'performances' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Artiste</th>
                <th>Note Moyenne</th>
                <th>Volume d'Avis</th>
                <th>Tendance</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {statsActuelles.performances?.map((perf) => {
                const styleBadge = getBadgeStyle(perf.tendance);
                
                return (
                  <tr key={perf.id}>
                    <td style={{ fontWeight: 'bold', fontSize: '15px' }}>{perf.artiste}</td>
                    <td>
                      <span style={{ fontWeight: 'bold', marginRight: '8px', fontSize: '15px' }}>
                        {perf.noteMoyenne !== '-' ? `${perf.noteMoyenne}/5` : ''}
                      </span>
                      <span style={{ fontSize: '12px' }}>{renderStars(perf.noteMoyenne)}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {perf.nbAvis > 0 ? `${perf.nbAvis.toLocaleString()} avis` : '0 avis'}
                    </td>
                    <td>
                      <span style={{ 
                        color: styleBadge.color, 
                        fontWeight: 'bold',
                        backgroundColor: styleBadge.bg,
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {styleBadge.icon}{perf.tendance}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => setArtisteSelectionne(perf)}
                        disabled={perf.nbAvis === 0}
                        className="btn-info"
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', 
                          border: `1px solid ${perf.nbAvis === 0 ? 'var(--border)' : 'var(--info)'}`, 
                          borderRadius: '5px',
                          color: perf.nbAvis === 0 ? 'var(--text-muted)' : 'var(--info)',
                          opacity: perf.nbAvis === 0 ? 0.5 : 1,
                          cursor: perf.nbAvis === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <MessageSquare size={16} /> Voir avis
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CONTENU DE L'ONGLET : VENTES --- */}
      {ongletActif === 'ventes' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit / Service</th>
                <th>Quantité Écoulée</th>
                <th>Revenu Total Estimé</th>
              </tr>
            </thead>
            <tbody>
              {statsActuelles.ventes?.map((vente) => (
                <tr key={vente.id}>
                  <td style={{ fontWeight: 'bold', fontSize: '15px' }}>{vente.type}</td>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{vente.quantite}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '15px' }}>{vente.revenu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODALE DES AVIS (Glassmorphism) --- */}
      {artisteSelectionne && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div className="card-padded" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto', backgroundColor: 'var(--surface)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '15px' }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--dark)' }}>Avis : {artisteSelectionne.artiste}</h2>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Note moyenne : {artisteSelectionne.noteMoyenne} / 5</span>
              </div>
              <button 
                onClick={() => setArtisteSelectionne(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {artisteSelectionne.commentaires && artisteSelectionne.commentaires.length > 0 ? (
                artisteSelectionne.commentaires.map((com, index) => (
                  <div key={index} style={{ backgroundColor: 'var(--bg)', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--dark)' }}>👤 {com.user}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{com.date}</span>
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                      {renderStars(com.note)}
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                      "{com.texte}"
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  Aucun avis n'a encore été publié.
                </p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Statistiques;