
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useSignupMethods = () => {
  const sendConfirmationEmail = async (name: string, email: string, confirmationToken: string) => {
    try {
      const confirmationUrl = `${window.location.origin}/confirm-email`;
      
      const { data, error } = await supabase.functions.invoke("send-confirmation-email", {
        body: { 
          name, 
          email,
          confirmationToken,
          confirmationUrl
        }
      });
      
      if (error) {
        console.error("Failed to send confirmation email:", error);
        toast.error("Failed to send confirmation email. Please try again.");
      }
    } catch (err) {
      console.error("Error sending confirmation email:", err);
      toast.error("An error occurred while sending the confirmation email");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Generate a confirmation token
      const confirmationToken = crypto.randomUUID();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            confirmation_token: confirmationToken // Store the token in user metadata
          }
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
        }
        
        // Send confirmation email with token
        await sendConfirmationEmail(name, email, confirmationToken);
        
        toast.success('Account created! Please check your email to confirm your account.');
        return true;
      }

      return false;
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
