import React, { useState } from 'react';

const ModalAjoutProduit = ({ onClose, onSave }) => {
  const [nouveauProduit, setNouveauProduit] = useState({
    nom: '', categorie: 'Merchandising', prix: 0, stock: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // On convertit les valeurs en vrais nombres avant de les envoyer au parent
    onSave({
      ...nouveauProduit,
      prix: parseFloat(nouveauProduit.prix),
      stock: parseInt(nouveauProduit.stock, 10)
    });
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
    }}>
      <div className="card-padded" style={{ width: '400px', backgroundColor: 'var(--surface)' }}>
        <h2 style={{ marginTop: 0, color: 'var(--dark)' }}>Ajouter un produit</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label className="form-label">Nom du produit</label>
            <input 
              type="text" className="form-input" required
              value={nouveauProduit.nom} onChange={(e) => setNouveauProduit({...nouveauProduit, nom: e.target.value})}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label className="form-label">Catégorie</label>
            <select 
              className="form-input"
              value={nouveauProduit.categorie} onChange={(e) => setNouveauProduit({...nouveauProduit, categorie: e.target.value})}
            >
              <option value="Merchandising">Merchandising</option>
              <option value="Billetterie">Billetterie</option>
              <option value="Services">Services</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Prix (€)</label>
              <input 
                type="number" className="form-input" required
                value={nouveauProduit.prix} onChange={(e) => setNouveauProduit({...nouveauProduit, prix: e.target.value})}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Stock</label>
              <input 
                type="number" className="form-input" required
                value={nouveauProduit.stock} onChange={(e) => setNouveauProduit({...nouveauProduit, stock: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Sauvegarder</button>
            <button type="button" onClick={onClose} style={{ padding: '10px', cursor: 'pointer', background: 'none', border: '1px solid var(--border)', borderRadius: '5px' }}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAjoutProduit;