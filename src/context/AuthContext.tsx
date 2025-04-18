
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, theme, setTheme } = useAuthState();
  const { login, loginWithGoogle, signup, logout, toggleTheme } = useAuthMethods(user, theme, setTheme);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      theme,
      login, 
      loginWithGoogle,
      signup, 
      logout,
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
};
