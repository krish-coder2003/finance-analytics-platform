import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Check expiration
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to unauthorized event from api
    const handleUnauthorized = () => logout();
    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      throw new Error(error.message || 'Error occurred during login');
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      throw new Error(error.message || 'Error occurred during registration');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
