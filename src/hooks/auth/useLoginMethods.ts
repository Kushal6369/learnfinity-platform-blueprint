
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLoginMethods = () => {
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
        await supabase.auth.signOut();
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
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
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

  return {
    login,
    loginWithGoogle,
  };
};
