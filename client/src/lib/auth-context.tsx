'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor' | 'viewer';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      
      // Provide more specific error messages
      if (errorMessage.includes('Invalid credentials')) {
        throw new Error('Invalid credentials');
      } else if (errorMessage.includes('not found')) {
        throw new Error('User not found');
      } else if (errorMessage.includes('inactive')) {
        throw new Error('Account is inactive');
      } else {
        throw new Error(errorMessage);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Call logout API
    api.post('/auth/logout').catch(console.error);
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      
      // Provide more specific error messages
      if (errorMessage.includes('already exists')) {
        if (errorMessage.includes('email')) {
          throw new Error('Email already exists');
        } else if (errorMessage.includes('username')) {
          throw new Error('Username already exists');
        } else {
          throw new Error('User already exists');
        }
      } else if (errorMessage.includes('validation')) {
        throw new Error('Validation error');
      } else {
        throw new Error(errorMessage);
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

