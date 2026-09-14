import axios from 'axios';

const api = axios.create({
    baseURL: 'http://LineUp_api.test/api', 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Intercepteur : Ajoute automatiquement le Token sur TOUTES les requêtes protégées
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;