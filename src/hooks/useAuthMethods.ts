
import { User, Theme } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthMethods = (
  user: User | null,
  theme: Theme,
  setTheme: (theme: Theme) => void
) => {
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

  return {
    login,
    loginWithGoogle,
    signup,
    logout,
    toggleTheme
  };
};
