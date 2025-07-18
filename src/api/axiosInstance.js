import axios from 'axios';

const api = axios.create({
  baseURL: 'https://54.210.224.54'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;