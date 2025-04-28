
import { User, Theme } from '@/types/auth';
import { useLoginMethods } from './auth/useLoginMethods';
import { useSignupMethods } from './auth/useSignupMethods';
import { usePasswordMethods } from './auth/usePasswordMethods';
import { useProfileMethods } from './auth/useProfileMethods';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthMethods = (
  user: User | null,
  theme: Theme,
  setTheme: (theme: Theme) => void
) => {
  const { login } = useLoginMethods();
  const { signup } = useSignupMethods();
  const { requestPasswordReset, verifyOTP, resetPassword } = usePasswordMethods();
  const { logout, updateProfile, updateTheme } = useProfileMethods(user);

  const toggleTheme = async () => {
    if (!user) {
      // For non-authenticated users, save theme to localStorage for persistence
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
      return;
    }
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating theme:', error);
        toast.error('Failed to update theme');
        return;
      }
      
      // Also update localStorage even for authenticated users for better persistence
      localStorage.setItem('theme', newTheme);
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      toast.success(`Theme updated to ${newTheme} mode`);
    } catch (err) {
      console.error('Error in toggleTheme:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return {
    login,
    signup,
    logout,
    toggleTheme,
    requestPasswordReset,
    verifyOTP,
    resetPassword,
    updateProfile
  };
};
