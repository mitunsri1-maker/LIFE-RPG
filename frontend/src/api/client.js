import axios from 'axios';

const getBaseURL = () => {
  const raw = import.meta.env.VITE_API_URL;
  if (raw && typeof raw === 'string' && raw.trim()) {
    const clean = raw.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  if (import.meta.env.DEV) {
    return '/api';
  }
  return 'https://life-rpg-axdm.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('life_rpg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('life_rpg_token');
      localStorage.removeItem('life_rpg_user');
      window.location.href = '/login?reason=session_expired';
    }
    return Promise.reject(err);
  }
);

export default api;
