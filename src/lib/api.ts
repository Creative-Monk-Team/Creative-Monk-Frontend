import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized API calls
export const apiService = {
  // Services
  getServices: () => api.get('/services').then(res => res.data),
  getServiceBySlug: (slug: string) => api.get(`/services/${slug}`).then(res => res.data),
  
  // Clients
  getClients: () => api.get('/clients').then(res => res.data),
  
  // Portfolio / Case Studies
  getPortfolio: () => api.get('/portfolio').then(res => res.data),
  getCaseStudyById: (id: string) => api.get(`/portfolio/${id}`).then(res => res.data),
};

export default api;
