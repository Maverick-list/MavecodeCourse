import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const normalizeUrl = (url) => {
  return 'https://api.mavecode.my.id/api'; // FORCE PRODUCTION URL
};

const BACKEND_URL = 'https://api.mavecode.my.id/api';
const AUTH_URL = 'https://api.mavecode.my.id/api';

// Debugging
console.log('API Config (FORCED):', { BACKEND_URL, AUTH_URL });

// VERSION 2.8 - FINAL HARDCODE
export const API = 'https://api.mavecode.my.id/api';
const AUTH_API = 'https://api.mavecode.my.id/api';

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
      // Kirim credential (ID Token dari Google) ke backend Node.js (5005)
      const res = await axios.post(`${AUTH_API}/auth/google`, { token: credential });

      setToken(res.data.token);
      setUser(res.data.user);
      setIsAdmin(false);
      localStorage.setItem('mavecode_token', res.data.token);
      localStorage.setItem('mavecode_is_admin', 'false');
      return res.data;
    } catch (err) {
      console.error('Google Login Error:', err);
      toast.error('Login Google gagal. Silakan coba lagi.');
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
    <AuthContext.Provider value={{ user, token, isAdmin, loading, login, register, adminLogin, googleLogin, logout }}>
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
