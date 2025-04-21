
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useSignupMethods = () => {
  const sendConfirmationEmail = async (name: string, email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-confirmation-email", {
        body: { name, email }
      });
      if (error) {
        console.error("Failed to send confirmation email:", error);
      }
    } catch (err) {
      console.error("Error sending confirmation email:", err);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            role: 'user',
            theme: 'dark',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Account created but profile setup failed');
          // Proceed anyway
        }
        // Send a custom confirmation email to user and admin
        await sendConfirmationEmail(name, email);
      }

      toast.success('Account created successfully! Please check your email to confirm your account.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred while creating your account');
      return false;
    }
  };

  return {
    signup
  };
};
