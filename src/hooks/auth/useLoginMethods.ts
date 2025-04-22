
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLoginMethods = () => {
  const login = async (email: string, password: string, employeeId?: string) => {
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

      // Special validation for admin login
      if (email === 'saikushalulli@gmail.com') {
        if (!employeeId || !employeeId.trim()) {
          toast.error('Employee ID is required for admin login');
          return false;
        }

        // Validate employee ID format (at least 8 characters, alphanumeric)
        if (employeeId.length < 8 || !/^[A-Za-z0-9]+$/.test(employeeId)) {
          toast.error('Employee ID must be at least 8 characters and contain only letters and numbers');
          return false;
        }
      }

      // Attempt login with Supabase
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
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

      // For admin users, verify employee ID
      if (email === 'saikushalulli@gmail.com') {
        if (employeeId !== 'RA2211003011971') {
          await supabase.auth.signOut();
          toast.error('Invalid employee ID');
          return false;
        }

        // Verify admin role in profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          await supabase.auth.signOut();
          toast.error('Error verifying admin account');
          return false;
        }

        if (!profileData || profileData.role !== 'admin') {
          await supabase.auth.signOut();
          toast.error('You do not have administrator privileges');
          return false;
        }
      }

      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred while logging in. Please try again later.');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            prompt: 'select_account', // Forces Google to show the account selection screen
          }
        }
      });

      if (error) {
        if (error.message.includes('popup')) {
          toast.error('The login popup was blocked. Please allow popups for this site.');
        } else {
          toast.error(error.message);
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('An error occurred during Google login. Please try again.');
      return false;
    }
  };

  return {
    login,
    loginWithGoogle,
  };
};
