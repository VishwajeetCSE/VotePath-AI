import React, { createContext, useState, useContext, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check for saved user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('votepath_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('votepath_user', JSON.stringify(userData));
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('votepath_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
