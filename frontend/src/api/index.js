import api from './client';

export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const questsApi = {
  getAll: (params) => api.get('/quests', { params }),
  getOne: (id) => api.get(`/quests/${id}`),
  create: (data) => api.post('/quests', data),
  update: (id, data) => api.put(`/quests/${id}`, data),
  delete: (id) => api.delete(`/quests/${id}`),
  complete: (id) => api.post(`/quests/${id}/complete`),
};

export const characterApi = {
  get: () => api.get('/character'),
  getStats: () => api.get('/character/stats'),
};

export const progressApi = {
  get: () => api.get('/progress'),
  getHistory: (params) => api.get('/progress/history', { params }),
  getStreak: () => api.get('/progress/streak'),
};

export const shopApi = {
  getItems: () => api.get('/shop/items'),
  buy: (id) => api.post(`/shop/items/${id}/buy`),
};

export const inventoryApi = {
  get: () => api.get('/inventory'),
  equip: (id) => api.post(`/inventory/${id}/equip`),
};
