
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLoginMethods = () => {
  const login = async (email: string, password: string) => {
    try {
      // Special handling for demo accounts
      if (email === 'demo.user@learnfinity.com' && password === 'demo123') {
        // Sign in with the demo user credentials
        const { error } = await supabase.auth.signInWithPassword({ 
          email: 'demo.user@learnfinity.com', 
          password: 'demo123' 
        });
        
        if (error) {
          console.error('Demo user login error:', error);
          toast.error('Error logging in with demo user account. Please try again.');
          return false;
        }
        
        toast.success('Logged in as Demo User');
        return true;
      }
      
      if (email === 'demo.admin@learnfinity.com' && password === 'admin123') {
        // Sign in with the demo admin credentials
        const { error } = await supabase.auth.signInWithPassword({ 
          email: 'demo.admin@learnfinity.com', 
          password: 'admin123' 
        });
        
        if (error) {
          console.error('Demo admin login error:', error);
          toast.error('Error logging in with demo admin account. Please try again.');
          return false;
        }
        
        toast.success('Logged in as Demo Admin');
        return true;
      }

      // Validate inputs for regular users
      if (!email.trim()) {
        toast.error('Please enter your email address');
        return false;
      }

      if (!password) {
        toast.error('Please enter your password');
        return false;
      }

      // Attempt login with Supabase for regular users
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error details:', error);
        
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
