import { Routes, Route, Navigate } from 'react-router-dom';

import LayoutAdmin from './components/layout/LayoutAdmin';
import LoginAdmin from './pages/LoginAdmin';
import ChoixFestival from './pages/ChoixFestival';
import ProfilUtilisateur from './pages/ProfilUtilisateur'; 
import AccueilAdmin from './pages/AccueilAdmin';
import GestionProduits from './pages/GestionProduits';
import EditerProduit from './pages/EditerProduit';
import GestionProgrammation from './pages/GestionProgrammation';
import Calendrier from './pages/Calendrier';
import Statistiques from './pages/Statistiques';
import PlanFestival from './pages/PlanFestival'; 

import Erreur404 from './pages/Erreur404';

import RoutePrivee from './components/RoutePrivee';

import './App.css'; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginAdmin />} />

      <Route element={<RoutePrivee />}>
        <Route path="/choix-festival" element={<ChoixFestival />} />
        <Route path="/profil" element={<ProfilUtilisateur />} />

        <Route path="/admin/:festivalId" element={<LayoutAdmin />}>
          <Route index element={<AccueilAdmin />} />
          <Route path="produits" element={<GestionProduits />} />
          <Route path="produits/:id" element={<EditerProduit />} />
          <Route path="programmation" element={<GestionProgrammation />} />
          <Route path="calendrier" element={<Calendrier />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="plan" element={<PlanFestival />} />
          
          {/* En cas de mauvais lien dans le tableau de bord */}
          <Route path="*" element={<Erreur404 />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/*3.En cas de mauvais lien n'importe ou ailleurs */}
      <Route path="*" element={<Erreur404 />} />
    </Routes>
  );
}

export default App;