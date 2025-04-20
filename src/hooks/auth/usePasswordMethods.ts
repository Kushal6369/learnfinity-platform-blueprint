
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const usePasswordMethods = () => {
  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error('Failed to send password reset instructions');
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify OTP');
      return false;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset successfully');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password');
      return false;
    }
  };

  return {
    requestPasswordReset,
    verifyOTP,
    resetPassword
  };
};
