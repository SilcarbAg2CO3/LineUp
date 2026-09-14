import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api'; 

const EditerProduit = () => {
  const { id, festivalId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // <-- On ajoute useLocation pour récupérer le state

  const [produit, setProduit] = useState({
    nom: '',
    categorie: 'Merchandising', // Valeur par défaut plus sûre
    prix: 0,
    stock: 0
  });

  const [chargement, setChargement] = useState(true);

  // --- 2. LECTURE DU PRODUIT (State React ou GET) ---
  useEffect(() => {
    // 1. Priorité au state envoyé par la page précédente (affichage instantané)
    if (location.state?.produitActuel) {
      setProduit(location.state.produitActuel);
      setChargement(false);
      return; // On arrête là, pas besoin d'appeler l'API
    }

    // 2. Fallback API (si l'utilisateur actualise la page avec F5)
    const fetchProduit = async () => {
      try {
        const response = await api.get(`/admin/produits/${id}`);
        setProduit(response.data);
      } catch (error) {
        console.error("Erreur API (Chargement produit) :", error);
        
        // Plan B (Fallback)
        const fausseBDD = [
          { id: 1, nom: "T-Shirt Officiel 2026", categorie: "Merchandising", prix: 25, stock: 450 },
          { id: 2, nom: "Pass VIP 3 Jours", categorie: "Billetterie", prix: 150, stock: 12 },
          { id: 3, nom: "Casier Taille M", categorie: "Services", prix: 25, stock: 0 },
          { id: 4, nom: "Gobelet Éco-cup", categorie: "Merchandising", prix: 2, stock: 5000 },
          { id: 5, nom: "Recharge Cashless 50€", categorie: "Services", prix: 50, stock: 999 },
        ];
        const produitTrouve = fausseBDD.find(p => p.id === parseInt(id));
        if (produitTrouve) setProduit(produitTrouve);
      } finally {
        setChargement(false);
      }
    };

    fetchProduit();
  }, [id, location.state]);

  const handleChange = (champ, valeur) => {
    setProduit({ ...produit, [champ]: valeur });
  };

  // --- 3. SAUVEGARDE (PUT) ---
  const handleSauvegarder = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await api.put(`/admin/produits/${id}`, produit);
      
      navigate(`/admin/${festivalId}/produits`, { 
        state: { 
          produitMisAJour: response.data, 
          messageSucces: `Le produit "${response.data.nom}" a été mis à jour avec succès.` 
        } 
      });

    } catch (error) {
      console.error("Erreur API (Mise à jour produit) :", error);
      
      // Fallback visuel
      navigate(`/admin/${festivalId}/produits`, { 
        state: { 
          produitMisAJour: produit, 
          messageSucces: `Le produit "${produit.nom}" a été mis à jour (Mode hors-ligne).` 
        } 
      });
    }
  };

  if (chargement) return <div style={{ padding: '30px' }}>Chargement du produit...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            marginRight: '20px', padding: '8px 15px', cursor: 'pointer', 
            backgroundColor: 'var(--border)', color: 'var(--text-dark)', 
            border: 'none', borderRadius: '5px', fontWeight: 'bold' 
          }}
        >
          ← Retour
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>Éditer le produit #{id}</h1>
      </div>

      <div className="card-padded" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSauvegarder}>
          
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Nom du produit</label>
            <input 
              type="text" 
              value={produit.nom} 
              onChange={(e) => handleChange('nom', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Catégorie</label>
            <select 
              value={produit.categorie} 
              onChange={(e) => handleChange('categorie', e.target.value)}
              className="form-input"
            >
              <option value="Merchandising">Merchandising</option>
              <option value="Billetterie">Billetterie</option>
              <option value="Services">Services</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Prix (€)</label>
              <input 
                type="number" 
                step="0.01"
                value={produit.prix} 
                onChange={(e) => handleChange('prix', parseFloat(e.target.value) || 0)}
                className="form-input"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Stock disponible</label>
              <input 
                type="number" 
                value={produit.stock} 
                onChange={(e) => handleChange('stock', parseInt(e.target.value, 10) || 0)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '16px', padding: '15px' }}>
            💾 Sauvegarder les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditerProduit;