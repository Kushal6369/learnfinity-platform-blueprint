
import { User, Theme } from '@/types/auth';
import { useLoginMethods } from './auth/useLoginMethods';
import { useSignupMethods } from './auth/useSignupMethods';
import { usePasswordMethods } from './auth/usePasswordMethods';
import { useProfileMethods } from './auth/useProfileMethods';

export const useAuthMethods = (
  user: User | null,
  theme: Theme,
  setTheme: (theme: Theme) => void
) => {
  const { login, loginWithGoogle } = useLoginMethods();
  const { signup } = useSignupMethods();
  const { requestPasswordReset, verifyOTP, resetPassword } = usePasswordMethods();
  const { logout, updateProfile } = useProfileMethods(user);

  const toggleTheme = async () => {
    if (!user) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const profileMethods = useProfileMethods(user);
    const success = await profileMethods.updateTheme(user.id, newTheme);
    
    if (success) {
      setTheme(newTheme);
    }
  };

  return {
    login,
    loginWithGoogle,
    signup,
    logout,
    toggleTheme,
    requestPasswordReset,
    verifyOTP,
    resetPassword,
    updateProfile
  };
};
