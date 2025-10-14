import { createContext } from 'react';

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }) {
  const authContextValue = {};
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
