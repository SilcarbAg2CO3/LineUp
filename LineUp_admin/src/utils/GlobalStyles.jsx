// src/utils/GlobalStyles.js

export const Colors = {
  primary: '#F98C2F', // couleur principale
  dark: '#05061A',    // bleu foncé pour menu et les titres
  background: '#F4F7F6', //gris clair du fond de page
  surface: 'white',   // fond des cartes et tableaux
  textDark: '#333',
  textMuted: '#666',
  border: '#EEE',
  danger: '#F44336',  // supprimer/erreurs
  success: '#4CAF50', // confirmations
  info: '#2196F3'     // édition/infos
};

export const globalStyles = {
  // conteneurs
  pageTitle: {
    color: Colors.dark,
    margin: '0 0 5px 0',
  },
  pageSubtitle: {
    color: Colors.textMuted,
    marginBottom: '30px',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  cardPadded: {
    backgroundColor: Colors.surface,
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    padding: '20px',
  },
  
  // boutons
  primaryBtn: {
    backgroundColor: Colors.primary,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: Colors.textMuted,
    border: '1px solid #CCC',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  actionBtnInfo: {
    background: 'none',
    border: 'none',
    color: Colors.info,
    cursor: 'pointer',
    marginRight: '10px'
  },
  actionBtnDanger: {
    background: 'none',
    border: 'none',
    color: Colors.danger,
    cursor: 'pointer'
  },

  // tableaux
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeader: {
    backgroundColor: Colors.dark,
    color: 'white',
  },
  tableCell: {
    padding: '15px',
  },
  tableRow: {
    borderBottom: `1px solid ${Colors.border}`,
  },
  
  // formulaires
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: `1px solid #CCC`,
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: Colors.textMuted,
    fontWeight: 'bold'
  }
};