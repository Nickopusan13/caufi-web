"use client"; // Must be a client component

import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false });

export const AuthProvider = ({
  children,
  isLoggedIn,
}: {
  children: ReactNode;
  isLoggedIn: boolean;
}) => {
  return (
    <AuthContext.Provider value={{ isAuthenticated: isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
