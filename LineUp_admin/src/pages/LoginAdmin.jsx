import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoLineUp from '../assets/LineUpLogoWhite.png';

const LoginAdmin = () => {
  const navigate = useNavigate();
  
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState(''); // gérer les erreurs laravel
  const [showModal, setShowModal] = useState(false);
  const [emailRecup, setEmailRecup] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur(''); // On réinitialise l'erreur à chaque tentative

    // Remplace ton bloc try/catch par celui-ci :
try {
  const response = await api.post('/admin/login', {
    email: identifiant,
    password: motDePasse // On change la clé ici pour 'password'
  });

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('estConnecte', 'true'); 
  
  navigate('/choix-festival');

} catch (error) {
  console.error("Erreur API :", error);
  setErreur(error.response?.data?.message || "Identifiants incorrects.");
}
  };

  const handleRecuperation = (e) => {
    e.preventDefault();
    alert(`Un lien de réinitialisation a été envoyé à l'adresse : ${emailRecup}`);
    setIdentifiant(emailRecup); 
    setShowModal(false);
  };

  const ouvrirModaleOubli = () => {
    setEmailRecup(identifiant);
    setShowModal(true);
  };

  const annulerModale = () => {
    if (emailRecup) {
      setIdentifiant(emailRecup);
    }
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg)' }}>
      
      <div className="card-padded" style={{ width: '400px', textAlign: 'center' }}>
        
        <img 
          src={logoLineUp} 
          alt="Logo LineUp Manager" 
          style={{ width: '80px', height: 'auto', marginBottom: '10px' }} 
        />

        <h1 className="page-title" style={{ marginTop: 0 }}>LineUp Manager</h1>
        <p className="page-subtitle" style={{ marginBottom: '30px' }}>Connectez-vous à votre espace administrateur</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div>
            <label className="form-label">Identifiant ou Email</label>
            <input 
              type="text" className="form-input" required placeholder="Ex: admin@festival.com"
              value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} 
            />
          </div>
          <div>
            <label className="form-label">Mot de passe</label>
            <input 
              type="password" className="form-input" required placeholder="••••••••"
              value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} 
            />
          </div>
          {erreur && <p style={{ color: 'var(--danger, red)', fontSize: '14px', margin: 0 }}>{erreur}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
            Se connecter
          </button>
        </form>

        <p 
          onClick={ouvrirModaleOubli}
          style={{ marginTop: '20px', fontSize: '13px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Mot de passe oublié ?
        </p>
      </div>

      {/* --- MODALE : MOT DE PASSE OUBLIÉ --- */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card-padded" style={{ width: '400px', backgroundColor: 'var(--surface)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--dark)' }}>Récupération</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Entrez votre adresse email. Nous vous enverrons un lien pour créer un nouveau mot de passe.
            </p>
            
            <form onSubmit={handleRecuperation}>
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Adresse Email</label>
                <input type="email" className="form-input" required placeholder="admin@festival.com" value={emailRecup} onChange={(e) => setEmailRecup(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Envoyer le lien</button>
                <button type="button" onClick={annulerModale} style={{ padding: '10px', cursor: 'pointer', background: 'none', border: '1px solid var(--border)', borderRadius: '5px', color: 'var(--text-muted)' }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginAdmin;