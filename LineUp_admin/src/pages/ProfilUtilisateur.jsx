import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Shield, Mail, Key } from 'lucide-react';
import api from '../services/api'; 

const ProfilUtilisateur = () => {
  const navigate = useNavigate();
  
  const [utilisateur, setUtilisateur] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: '', 
    motDePasseActuel: '',
    nouveauMotDePasse: ''
  });

  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  // 1. Récupération des données au chargement (Route GET /admin/user)
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await api.get('/admin/user'); 
        setUtilisateur(prevState => ({
          ...prevState,
          prenom: response.data.prenom || '',
          nom: response.data.nom || '',
          email: response.data.email || '',
          role: response.data.role || 'Administrateur',
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        setErreur("Impossible de charger les informations du profil.");
      }
    };

    fetchProfil();
  }, []);

  // 2. Envoi des modifications (Route PUT /admin/profil)
  const handleSauvegarder = async (e) => {
    e.preventDefault();
    setMessage('');
    setErreur('');

    try {
      const payload = {
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email,
      };

      // On n'ajoute les champs password que s'ils sont saisis
      if (utilisateur.nouveauMotDePasse) {
        payload.password = utilisateur.nouveauMotDePasse;
        payload.password_confirmation = utilisateur.confirmationMotDePasse;
        payload.current_password = utilisateur.motDePasseActuel; 
      }

      const response = await api.put('/admin/profil', payload);

      setMessage('Vos informations ont été mises à jour avec succès !');
      
      // On met à jour l'affichage avec les données renvoyées par le serveur
      setUtilisateur(prevState => ({
        ...prevState,
        prenom: response.data.user.prenom,
        nom: response.data.user.nom,
        email: response.data.user.email,
        motDePasseActuel: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: ''
      }));

      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErreur(error.response?.data?.message || "Une erreur est survenue lors de la sauvegarde.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
        <button 
          onClick={() => navigate('/choix-festival')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-dark)' }}
          title="Retour aux festivals"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '5px', marginTop: 0 }}>Mon Profil</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Gérez vos informations personnelles et vos paramètres de sécurité.</p>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {message && (
          <div style={{ padding: '15px', backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', borderRadius: '8px', fontWeight: 'bold', border: '1px solid #4caf50' }}>
            ✅ {message}
          </div>
        )}
        {erreur && (
          <div style={{ padding: '15px', backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#f44336', borderRadius: '8px', fontWeight: 'bold', border: '1px solid #f44336' }}>
            ❌ {erreur}
          </div>
        )}

        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--surface)', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: 'var(--dark)', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
            <Shield size={20} color="var(--primary)" /> Informations Personnelles
          </h2>
          
          <form onSubmit={handleSauvegarder}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Prénom</label>
                <input 
                  type="text" className="form-input" required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  value={utilisateur.prenom} onChange={(e) => setUtilisateur({...utilisateur, prenom: e.target.value})} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nom</label>
                <input 
                  type="text" className="form-input" required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  value={utilisateur.nom} onChange={(e) => setUtilisateur({...utilisateur, nom: e.target.value})} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontWeight: '600' }}>
                <Mail size={16} /> Adresse Email
              </label>
              <input 
                type="email" className="form-input" required 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                value={utilisateur.email} onChange={(e) => setUtilisateur({...utilisateur, email: e.target.value})} 
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Rôle (Lecture seule)</label>
              <input 
                type="text" className="form-input" disabled 
                value={utilisateur.role} 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
              />
            </div>

            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--dark)', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
              <Key size={20} color="#f44336" /> Sécurité
            </h2>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
  <div style={{ flex: 1 }}>
    <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mot de passe actuel</label>
    <input 
      type="password" className="form-input" placeholder="••••••••" 
      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
      value={utilisateur.motDePasseActuel || ''} 
      onChange={(e) => setUtilisateur({...utilisateur, motDePasseActuel: e.target.value})} 
    />
  </div>
  <div style={{ flex: 1 }}>
    <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nouveau mot de passe</label>
    <input 
      type="password" className="form-input" placeholder="Laisser vide" 
      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
      value={utilisateur.nouveauMotDePasse || ''} 
      onChange={(e) => setUtilisateur({...utilisateur, nouveauMotDePasse: e.target.value})} 
    />
  </div>
  <div style={{ flex: 1 }}>
    <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Confirmer le mot de passe</label>
    <input 
      type="password" className="form-input" placeholder="Confirmer" 
      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
      value={utilisateur.confirmationMotDePasse || ''} 
      onChange={(e) => setUtilisateur({...utilisateur, confirmationMotDePasse: e.target.value})} 
    />
  </div>
</div>

<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 25px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
    <Save size={18} /> Sauvegarder les modifications
  </button>
</div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilUtilisateur;