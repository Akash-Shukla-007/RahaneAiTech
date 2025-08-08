import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we have a token (authenticated user)
    // and the error is a 401 (Unauthorized)
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      // Don't redirect immediately, let the component handle it
      // This prevents race conditions during initial auth checks
      console.warn('Authentication token expired or invalid');
    }
    return Promise.reject(error);
  }
);

export default api;

