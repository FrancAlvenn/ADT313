import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('accessToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  const setAuthData = (data) => {
    setAuth({
      accessToken: data.accessToken,
      user: data.user,
    });

    // Save to localStorage for persistence
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const clearAuthData = () => {
    setAuth({
      accessToken: null,
      user: null,
    });

    // Remove from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
