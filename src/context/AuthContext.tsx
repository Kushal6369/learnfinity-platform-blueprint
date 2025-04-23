
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data } = await supabase.auth.getSession();
      if (window.location.hash && !data.session) {
        console.log("Processing auth redirect");
      }
    };
    
    handleAuthStateChange();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast.success('Welcome back!');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Logged out successfully');
      }
    });
    
    return () => {
      subscription.unsubscribe();
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
