import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Use environment variables or default to localhost
// Trim whitespace/newlines and ensure /api suffix
const cleanUrl = (url) => {
  let cleaned = (url || '').trim();
  if (cleaned && !cleaned.endsWith('/api')) {
    cleaned = cleaned.replace(/\/+$/, '') + '/api';
  }
  return cleaned;
};

export const API = cleanUrl(process.env.REACT_APP_BACKEND_URL) || 'http://localhost:8000/api';
const AUTH_API = cleanUrl(process.env.REACT_APP_AUTH_URL) || 'http://localhost:8000/api';

// Debugging
console.log('API Config:', { API, AUTH_API });

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mavecode_token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('mavecode_is_admin') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await axios.get(`${AUTH_API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${AUTH_API}/auth/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    setIsAdmin(false);
    localStorage.setItem('mavecode_token', res.data.token);
    localStorage.setItem('mavecode_is_admin', 'false');
    return res.data;
  };

  const register = async (email, password, name, phone) => {
    const res = await axios.post(`${AUTH_API}/auth/register`, { email, password, name, phone });
    setToken(res.data.token);
    setUser(res.data.user);
    setIsAdmin(false);
    localStorage.setItem('mavecode_token', res.data.token);
    localStorage.setItem('mavecode_is_admin', 'false');
    return res.data;
  };

  const adminLogin = async (username, password) => {
    const res = await axios.post(`${AUTH_API}/auth/admin`, { username, password });
    setToken(res.data.token);
    setUser({ id: 'admin', name: 'Admin', email: 'admin@mavecode.id' });
    setIsAdmin(true);
    localStorage.setItem('mavecode_token', res.data.token);
    localStorage.setItem('mavecode_is_admin', 'true');
    return res.data;
  };

  const googleLogin = async (credential) => {
    try {
      console.log('Sending Google credential to backend:', `${AUTH_API}/auth/google`);
      const res = await axios.post(`${AUTH_API}/auth/google`, { token: credential }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Google Login Response:', res.data);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAdmin(false);
      localStorage.setItem('mavecode_token', res.data.token);
      localStorage.setItem('mavecode_is_admin', 'false');
      return res.data;
    } catch (err) {
      console.error('Google Login Error Details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('mavecode_token');
    localStorage.removeItem('mavecode_is_admin');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, isAdmin, loading, login, register, adminLogin, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Theme Context
const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('mavecode_theme');
    return saved ? saved === 'dark' : true;
  });
  const [isStudyMode, setIsStudyMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('mavecode_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.body.classList.toggle('study-mode', isStudyMode);
  }, [isStudyMode]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleStudyMode = () => setIsStudyMode(!isStudyMode);

  return (
    <ThemeContext.Provider value={{ isDark, isStudyMode, toggleTheme, toggleStudyMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// API Helper with auth
export const apiClient = axios.create({ baseURL: API });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mavecode_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
