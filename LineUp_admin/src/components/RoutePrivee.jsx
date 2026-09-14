import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoutePrivee = () => {
  // On cherche le vrai token d'authentification Laravel dans le stockage local
  const token = localStorage.getItem('token');

  // S'il possède un token, on le laisse accéder au tableau de bord (<Outlet />)
  // Sinon, on le redirige vers la page de connexion
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RoutePrivee;