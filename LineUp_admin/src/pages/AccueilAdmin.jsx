import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Ticket, CreditCard, Lock, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api'; 

const AccueilAdmin = () => {
  const { festivalId } = useParams();
  const [donnees, setDonnees] = useState({ stats: null, graphique: [] });
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(`/admin/festivals/${festivalId}/dashboard`);
        setDonnees(response.data);
        setErreur(false);
      } catch (error) {
        console.error("Erreur de récupération du dashboard :", error);
        setErreur(true);
      } finally {
        setChargement(false);
      }
    };

    fetchDashboard();
  }, [festivalId]);

  const statsDisplay = [
    { titre: "Billets Vendus", valeur: donnees.stats?.billets || "0", icon: <Ticket size={28} color="var(--success)" />, color: "var(--success)" },
    { titre: "Revenus Cashless", valeur: donnees.stats?.cashless || "0 €", icon: <CreditCard size={28} color="var(--info)" />, color: "var(--info)" },
    { titre: "Casiers Réservés", valeur: donnees.stats?.casiers || "0", icon: <Lock size={28} color="var(--primary)" />, color: "var(--primary)" },
    { titre: "Alertes Sécurité", valeur: donnees.stats?.alertes || "0", icon: <AlertTriangle size={28} color="var(--danger)" />, color: "var(--danger)" }
  ];

  if (chargement) return <p style={{ padding: '30px' }}>Chargement du tableau de bord...</p>;
  if (erreur) return <p style={{ padding: '30px', color: 'var(--danger)' }}>Erreur de connexion. Impossible de charger les données.</p>;

  return (
    <div>
      <h1 className="page-title">Tableau de Bord</h1>
      <p className="page-subtitle">Bienvenue sur l'interface d'administration du festival.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {statsDisplay.map((stat, index) => (
          <div key={index} className="card-padded" style={{ borderLeft: `5px solid ${stat.color}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '15px' }}>
              {stat.icon}
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {stat.titre}
            </h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: 'var(--dark)' }}>
              {stat.valeur}
            </p>
          </div>
        ))}
      </div>

      <div className="card-padded">
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--dark)' }}>
          Évolution des Ventes & Recharges Cashless
        </h2>
        
        <div style={{ width: '100%', height: '350px' }}>
          {donnees.graphique && donnees.graphique.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donnees.graphique} margin={{ top: 10, right: 40, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBillets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCashless" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--info)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--info)" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dx={10} />
                
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                
                <Area yAxisId="left" type="monotone" dataKey="billets" name="Billets Vendus" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorBillets)" />
                <Area yAxisId="right" type="monotone" dataKey="cashless" name="Cashless (€)" stroke="var(--info)" strokeWidth={3} fillOpacity={1} fill="url(#colorCashless)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Aucune donnée d'évolution disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccueilAdmin;