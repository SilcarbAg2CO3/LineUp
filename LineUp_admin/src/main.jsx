import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css' // fichier de style global par défaut

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter active le routage pour toute l'application */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)