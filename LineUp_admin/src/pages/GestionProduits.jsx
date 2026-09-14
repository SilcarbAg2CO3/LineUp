import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../services/api'; 

import ModalAjoutProduit from '../components/ModalAjoutProduit';

const GestionProduits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { festivalId } = useParams();

  const [produits, setProduits] = useState([]); 
  const [messageAlerte, setMessageAlerte] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes');
  const [showModal, setShowModal] = useState(false);

  // Plan B (Fallback) en cas de crash serveur total
  const donneesDeSecours = [
    { id: 1, nom: "T-Shirt Officiel 2026", categorie: "Merchandising", prix: 25, stock: 450 },
    { id: 2, nom: "Pass VIP 3 Jours", categorie: "Billetterie", prix: 150, stock: 12 },
    { id: 3, nom: "Casier Taille M", categorie: "Services", prix: 25, stock: 0 },
    { id: 4, nom: "Gobelet Éco-cup", categorie: "Merchandising", prix: 2, stock: 5000 },
    { id: 5, nom: "Recharge Cashless 50€", categorie: "Services", prix: 50, stock: 999 },
  ];

  // --- 1. LECTURE (GET) ---
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await api.get(`/admin/festivals/${festivalId}/produits`);
        // Sécurité : Si response.data est null ou pas un tableau, on met un tableau vide
        setProduits(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur API (Chargement des produits) :", error);
        // Si erreur 404 ou 500, on active le secours pour ne pas avoir d'écran blanc
        setProduits(donneesDeSecours);
      }
    };
    if (festivalId) fetchProduits();
  }, [festivalId]);

  // --- 2. GESTION DES RETOURS D'ÉDITION ---
  useEffect(() => {
    if (location.state?.produitMisAJour) {
      setProduits(prev => 
        prev.map(p => p.id === location.state.produitMisAJour.id ? location.state.produitMisAJour : p)
      );
    }
    
    if (location.state?.messageSucces) {
      setMessageAlerte(location.state.messageSucces);
      const timer = setTimeout(() => setMessageAlerte(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // --- 3. FILTRAGE SÉCURISÉ ---
  const produitsFiltres = (produits || []).filter((produit) => {
    if (!produit || !produit.nom) return false;
    const correspondRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase());
    const correspondCategorie = filtreCategorie === 'Toutes' || produit.categorie === filtreCategorie;
    return correspondRecherche && correspondCategorie;
  });

  // --- 4. SUPPRESSION (DELETE) ---
  const handleSupprimer = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${nom}" ?`)) {
      try {
        await api.delete(`/admin/produits/${id}`);
        setProduits(prev => prev.filter(p => p.id !== id));
        setMessageAlerte(`Produit "${nom}" supprimé.`);
        setTimeout(() => setMessageAlerte(null), 3000);
      } catch (error) {
        console.error("Erreur suppression :", error);
        // Fallback visuel pour le confort
        setProduits(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  // --- 5. CRÉATION (POST) ---
  const handleAjouter = async (nouveauProduitRecu) => {
    try {
      const response = await api.post(`/admin/festivals/${festivalId}/produits`, nouveauProduitRecu);
      const produitCree = response.data;
      
      setProduits(prev => [...prev, produitCree]); 
      setShowModal(false);
      setMessageAlerte(`Produit "${produitCree.nom}" ajouté avec succès !`);
      setTimeout(() => setMessageAlerte(null), 3000);
    } catch (error) {
      console.error("Erreur ajout :", error);
      // Fallback local pour continuer à travailler
      const fallback = { ...nouveauProduitRecu, id: Date.now() };
      setProduits(prev => [...prev, fallback]);
      setShowModal(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {messageAlerte && (
        <div style={{ backgroundColor: '#4caf50', color: 'white', padding: '15px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ✅ {messageAlerte}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">Gestion des Produits</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          + Ajouter un produit
        </button>
      </div>

      <div className="card-padded" style={{ display: 'flex', gap: '20px', marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ flex: 1 }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Rechercher un produit</label>
          <input 
            type="text" placeholder="Ex: T-Shirt, Casier..." 
            value={recherche} onChange={(e) => setRecherche(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ width: '250px' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Filtrer par catégorie</label>
          <select 
            value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="Toutes">Toutes les catégories</option>
            <option value="Merchandising">Merchandising</option>
            <option value="Billetterie">Billetterie</option>
            <option value="Services">Services</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Nom</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Catégorie</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Prix</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Stock</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produitsFiltres.length > 0 ? (
              produitsFiltres.map((produit) => (
                <tr key={produit.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '15px', color: '#666' }}>#{produit.id}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{produit.nom}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ backgroundColor: '#e9ecef', padding: '5px 10px', borderRadius: '20px', fontSize: '12px' }}>
                      {produit.categorie}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>{produit.prix} €</td>
                  <td style={{ padding: '15px', color: produit.stock === 0 ? '#dc3545' : 'inherit', fontWeight: produit.stock === 0 ? 'bold' : 'normal' }}>
                    {produit.stock === 0 ? 'Rupture' : produit.stock}
                  </td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => navigate(`/admin/${festivalId}/produits/${produit.id}`, { state: { produitActuel: produit } })} 
                      style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      ✏️ Éditer
                    </button>
                    <button 
                      onClick={() => handleSupprimer(produit.id, produit.nom)} 
                      style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      🗑️ Suppr.
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ModalAjoutProduit 
          onClose={() => setShowModal(false)} 
          onSave={handleAjouter} 
        />
      )}

    </div>
  );
};

export default GestionProduits;