import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { supabase } from '@/integrations/supabase/client';

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
  const { 
    login, 
    loginWithGoogle, 
    signup, 
    logout, 
    toggleTheme,
    requestPasswordReset,
    verifyOTP,
    resetPassword,
    updateProfile
  } = useAuthMethods(user, theme, setTheme);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  // Ensure Google redirect is handled properly
  React.useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data } = await supabase.auth.getSession();
      // If there's a hash in the URL, it might be a redirect from OAuth
      if (window.location.hash && !data.session) {
        console.log("Processing auth redirect");
      }
    };
    
    handleAuthStateChange();
  }, []);

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
      toggleTheme,
      requestPasswordReset,
      verifyOTP,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
