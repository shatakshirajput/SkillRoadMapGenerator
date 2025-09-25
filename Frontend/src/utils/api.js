import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
   console.log('Request Headers:', config.headers);
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const roadmapsAPI = {
  generate: async (roadmapData) => {
    const response = await api.post('/roadmaps/generate', roadmapData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/roadmaps');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/roadmaps/${id}`);
    return response.data;
  },
  
  updateTopicCompletion: async (roadmapId, topicId, completed) => {
    const response = await api.patch(`/roadmaps/${roadmapId}/topics/${topicId}/complete`, {
      completed
    });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/roadmaps/${id}`);
    return response.data;
  }
};

export default api;