import axios from 'axios';
import { supabase } from '../lib/supabase';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Automatically inject Supabase JWT access token into Authorization header
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn('Could not attach session token to request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error unwrapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// API Service modules
export const transactionsApi = {
  getAll: (params) => api.get('/transactions', { params }).then((r) => r.data),
  getById: (id) => api.get(`/transactions/${id}`).then((r) => r.data),
  create: (data) => api.post('/transactions', data).then((r) => r.data),
  update: (id, data) => api.put(`/transactions/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/transactions/${id}`).then((r) => r.data),
};

export const budgetsApi = {
  getCurrent: (params) => api.get('/budgets/current', { params }).then((r) => r.data),
  createOrUpdate: (data) => api.post('/budgets', data).then((r) => r.data),
  update: (id, data) => api.put(`/budgets/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/budgets/${id}`).then((r) => r.data),
};

export const dashboardApi = {
  getSummary: (params) => api.get('/dashboard/summary', { params }).then((r) => r.data),
};

export const profileApi = {
  getProfile: () => api.get('/profile').then((r) => r.data),
  updateProfile: (data) => api.put('/profile', data).then((r) => r.data),
};

export default api;
