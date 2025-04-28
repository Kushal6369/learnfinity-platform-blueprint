
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLoginMethods = () => {
  const login = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email.trim()) {
        toast.error('Please enter your email address');
        return false;
      }

      if (!password) {
        toast.error('Please enter your password');
        return false;
      }

      // Attempt login with Supabase
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (error.message.includes('rate limit')) {
          toast.error('Too many login attempts. Please try again later.');
        } else {
          toast.error(error.message);
        }
        return false;
      }

      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred while logging in. Please try again later.');
      return false;
    }
  };

  return {
    login,
  };
};
