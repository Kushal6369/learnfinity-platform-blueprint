
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useSignupMethods = () => {
  const sendWelcomeEmail = async (name: string, email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-confirmation-email", {
        body: { name, email }
      });
      if (error) {
        console.error("Failed to send welcome email:", error);
      }
    } catch (err) {
      console.error("Error sending welcome email:", err);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
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
        // Send a welcome email to user and admin
        await sendWelcomeEmail(name, email);
        
        // Since we're not requiring email confirmation, sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Auto sign-in error:', signInError);
          toast.error('Account created but automatic login failed. Please log in manually.');
          return false;
        }
      }

      toast.success('Account created successfully! Redirecting to dashboard...');
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
