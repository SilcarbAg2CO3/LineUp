import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Erreur404 = () => {
  const navigate = useNavigate();
  const [compte, setCompte] = useState(5);

  useEffect(() => {
    // timer de navigation
    const interval = setInterval(() => {
      setCompte((prev) => {
        if (prev <= 1) {
          navigate('/choix-festival'); // navigation automatique
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg)' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--primary)', margin: 0 }}>404</h1>
      <h2 style={{ color: 'var(--dark)' }}>Page introuvable</h2>
      <p style={{ color: 'var(--text-muted)' }}>
        Redirection automatique dans <strong>{compte}</strong> secondes...
      </p>
    </div>
  );
};

export default Erreur404;