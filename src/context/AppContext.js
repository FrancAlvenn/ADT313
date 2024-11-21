import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

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

    setMovie(null);

    // Remove from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  // Movie-related state
  const [movie, setMovie] = useState(null);

  const setMovieData = (movieData) => {
    setMovie(movieData);
  };

  const clearMovieData = () => {
    setMovie(null);
  };

  return (
    <AppContext.Provider value={{ auth, setAuthData, clearAuthData, movie, setMovieData}}>
      {children}
    </AppContext.Provider>
  );
};
