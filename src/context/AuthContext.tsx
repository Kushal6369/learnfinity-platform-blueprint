
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
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

  // Handle Google redirect properly
  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data } = await supabase.auth.getSession();
      // If there's a hash in the URL, it might be a redirect from OAuth
      if (window.location.hash && !data.session) {
        console.log("Processing auth redirect");
        // The hash will be processed by Supabase's onAuthStateChange handler
      }
    };
    
    handleAuthStateChange();
    
    // Check for auth redirects
    const handleHashChange = () => {
      if (window.location.hash.includes('access_token') || window.location.hash.includes('error')) {
        console.log("Detected auth redirect in URL hash");
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
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
