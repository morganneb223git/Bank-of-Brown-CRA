// User Context ./frontend/src/contexts/UserContext.js

import React from 'react';

// Create the context
const UserContext = React.createContext(null);

// Export the context
export default UserContext;

// Optionally, create and export a custom hook for using this context
export function useUserContext() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContext.Provider');
  }
  return context;
}