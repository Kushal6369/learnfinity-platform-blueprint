
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Theme type
type Theme = 'light' | 'dark';

// User type
type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  theme: Theme;
  employeeId?: string;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  theme: Theme;
  login: (email: string, password: string, employeeId?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email!,
            role: profile.role,
            avatar: profile.avatar_url,
            theme: profile.theme as Theme,
            employeeId: profile.employee_id
          });
          setTheme(profile.theme as Theme);
          document.documentElement.classList.toggle('dark', profile.theme === 'dark');
        }
      } else {
        setUser(null);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: session.user.id,
                name: profile.name,
                email: session.user.email!,
                role: profile.role,
                avatar: profile.avatar_url,
                theme: profile.theme as Theme,
                employeeId: profile.employee_id
              });
              setTheme(profile.theme as Theme);
              document.documentElement.classList.toggle('dark', profile.theme === 'dark');
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, employeeId?: string) => {
    try {
      if (email === 'saikushalulli@gmail.com' && !employeeId) {
        toast.error('Employee ID is required for admin login');
        return false;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      if (email === 'saikushalulli@gmail.com' && employeeId !== 'RA2211003011971') {
        await logout();
        toast.error('Invalid employee ID');
        return false;
      }

      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred while logging in');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('An error occurred during Google login');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Account created successfully');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred while creating your account');
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred while logging out');
    }
  };

  const toggleTheme = async () => {
    if (!user) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('id', user.id);

      if (error) throw error;

      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    } catch (error) {
      console.error('Theme update error:', error);
      toast.error('Failed to update theme preference');
    }
  };

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
