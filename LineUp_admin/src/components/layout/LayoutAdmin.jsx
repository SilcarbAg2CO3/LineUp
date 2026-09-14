import React, { useState, useEffect } from 'react'; // <-- Ajout des hooks
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../../services/api'; // <-- Ajout de l'API

import logoLineUp from '../../assets/LineUpLogo.jpg';

const LayoutAdmin = () => {
  const navigate = useNavigate();
  const { festivalId } = useParams(); 

  // On remplace le dictionnaire en dur par un état React
  const [festivalActuel, setFestivalActuel] = useState({ nom: 'Chargement...', annee: '' });

  // On va chercher le bon festival au chargement du composant
  useEffect(() => {
    const fetchFestival = async () => {
      try {
        // Appelle l'API : GET /api/admin/festivals/{id}
        const response = await api.get(`/admin/festivals/${festivalId}`);
        // On suppose que l'API renvoie un objet avec "nom" et "annee" (adapte selon ton SQL)
        setFestivalActuel({ 
          nom: response.data.nom, 
          annee: response.data.annee || 'Édition en cours' // Valeur par défaut si pas d'année
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du festival", error);
        setFestivalActuel({ nom: 'Festival introuvable', annee: '' });
      }
    };

    fetchFestival();
  }, [festivalId]); // Se relance si l'ID dans l'URL change

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      
      <nav style={{ 
        width: '250px', 
        minWidth: '250px', 
        flexShrink: 0,     
        backgroundColor: 'var(--dark, #05061A)', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column',
        overflowY: 'auto' 
      }}>
        
        <div style={{ marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={logoLineUp} 
            alt="Logo LineUp" 
            style={{ width: '45px', height: '45px', objectFit: 'contain' }} 
          />
          <div>
            {/* L'affichage se mettra à jour tout seul quand l'API répondra */}
            <h2 style={{ color: 'var(--primary, #F98C2F)', margin: '0 0 5px 0', fontSize: '18px', lineHeight: '1.2' }}>{festivalActuel.nom}</h2>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{festivalActuel.annee}</span>
          </div>
        </div>
        
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
  <li>
    <NavLink to={`/admin/${festivalId}`} end style={({ isActive }) => ({ 
      color: isActive ? 'var(--primary)' : 'white', textDecoration: 'none', fontSize: '15px', display: 'block', padding: '10px',
      backgroundColor: isActive ? 'rgba(249, 140, 47, 0.1)' : 'transparent', borderRadius: '5px'
    })}>
      📊 Tableau de bord
    </NavLink>
  </li>
  <li>
    <NavLink to={`/admin/${festivalId}/produits`} style={({ isActive }) => ({ 
      color: isActive ? 'var(--primary)' : 'white', textDecoration: 'none', fontSize: '15px', display: 'block', padding: '10px',
      backgroundColor: isActive ? 'rgba(249, 140, 47, 0.1)' : 'transparent', borderRadius: '5px'
    })}>
      🍔 Produits
    </NavLink>
  </li>
  <li>
    <NavLink to={`/admin/${festivalId}/programmation`} style={({ isActive }) => ({ 
      color: isActive ? 'var(--primary)' : 'white', textDecoration: 'none', fontSize: '15px', display: 'block', padding: '10px',
      backgroundColor: isActive ? 'rgba(249, 140, 47, 0.1)' : 'transparent', borderRadius: '5px'
    })}>
      🎸 Programmation
    </NavLink>
  </li>
  <li>
    <NavLink to={`/admin/${festivalId}/calendrier`} style={({ isActive }) => ({ 
      color: isActive ? 'var(--primary)' : 'white', textDecoration: 'none', fontSize: '15px', display: 'block', padding: '10px',
      backgroundColor: isActive ? 'rgba(249, 140, 47, 0.1)' : 'transparent', borderRadius: '5px'
    })}>
      📅 Calendrier
    </NavLink>
  </li>
  <li>
    <NavLink to={`/admin/${festivalId}/statistiques`} style={({ isActive }) => ({ 
      color: isActive ? 'var(--primary)' : 'white', textDecoration: 'none', fontSize: '15px', display: 'block', padding: '10px',
      backgroundColor: isActive ? 'rgba(249, 140, 47, 0.1)' : 'transparent', borderRadius: '5px'
    })}>
      📈 Statistiques
    </NavLink>
  </li>
  <li>
    <NavLink to={`/admin/${festivalId}/plan`} style={({ isActive }) => ({ 
      color: isActive ? 'var(--primary)' : 'white', textDecoration: 'none', fontSize: '15px', display: 'block', padding: '10px',
      backgroundColor: isActive ? 'rgba(249, 140, 47, 0.1)' : 'transparent', borderRadius: '5px'
    })}>
      🗺️ Plan du Festival
    </NavLink>
  </li>
</ul>

        <button 
          onClick={() => navigate('/choix-festival')}
          style={{ 
            backgroundColor: 'transparent', 
            color: 'rgba(255,255,255,0.7)', 
            border: '1px solid rgba(255,255,255,0.2)', 
            padding: '12px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            textAlign: 'left', 
            marginTop: 'auto',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          🔄 Retour au Hub
        </button>
      </nav>

      <main style={{ flex: 1, backgroundColor: 'var(--bg, #F4F7F6)', padding: '30px', overflowY: 'auto' }}>
        <Outlet />
      </main>

    </div>
  );
};

export default LayoutAdmin;