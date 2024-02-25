// src/contexts/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Directly use useAuth0

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect(); // Trigger login if not authenticated and not loading
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, login: loginWithRedirect, logout }}>
      {!isLoading && children} // Render children when not loading
    </AuthContext.Provider>
  );
};
