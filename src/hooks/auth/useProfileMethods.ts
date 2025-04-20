
import { User } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProfileMethods = (user: User | null) => {
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

  const updateProfile = async (data: { name: string; avatar?: string }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          avatar_url: data.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const updateTheme = async (userId: string, newTheme: 'light' | 'dark') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('id', userId);

      if (error) throw error;
      
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return true;
    } catch (error) {
      console.error('Theme update error:', error);
      toast.error('Failed to update theme preference');
      return false;
    }
  };

  return {
    logout,
    updateProfile,
    updateTheme
  };
};
