
import { useState, useEffect } from 'react';
import { User, Theme } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // If it's a new Google signup, we might need to create the profile
          if (event === "SIGNED_IN" && session.user.app_metadata.provider === 'google') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
                role: 'user',
                theme: 'dark',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
              
            if (!insertError) {
              // Retry fetching the profile
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (newProfile) {
                setUser({
                  id: session.user.id,
                  name: newProfile.name,
                  email: session.user.email!,
                  role: newProfile.role as 'user' | 'admin',
                  avatar: newProfile.avatar_url,
                  theme: newProfile.theme as Theme,
                  employeeId: newProfile.employee_id
                });
                setTheme(newProfile.theme as Theme);
                document.documentElement.classList.toggle('dark', newProfile.theme === 'dark');
                
                // If it's a redirect from Google, show welcome toast
                if (event === "SIGNED_IN" && !user) {
                  toast.success(`Welcome ${newProfile.name}!`);
                }
              }
            } else {
              console.error("Error creating profile:", insertError);
            }
          }
        } else if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email!,
            role: profile.role as 'user' | 'admin',
            avatar: profile.avatar_url,
            theme: profile.theme as Theme,
            employeeId: profile.employee_id
          });
          setTheme(profile.theme as Theme);
          document.documentElement.classList.toggle('dark', profile.theme === 'dark');
          
          // If it's a redirect from Google or new login, show welcome toast
          if (event === "SIGNED_IN" && !user) {
            toast.success(`Welcome ${profile.name}!`);
          }
        }
      } else {
        setUser(null);
        // Revert to default theme or get from localStorage when logged out
        const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
      
      setIsLoading(false);
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
              setIsLoading(false);
              return;
            }
            
            if (profile) {
              setUser({
                id: session.user.id,
                name: profile.name,
                email: session.user.email!,
                role: profile.role as 'user' | 'admin',
                avatar: profile.avatar_url,
                theme: profile.theme as Theme,
                employeeId: profile.employee_id
              });
              setTheme(profile.theme as Theme);
              document.documentElement.classList.toggle('dark', profile.theme === 'dark');
            }
            
            setIsLoading(false);
          });
      } else {
        const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        setIsLoading(false);
      }
    });

    // Check for auth redirects
    const handleHashChange = async () => {
      if (window.location.hash.includes('access_token') || window.location.hash.includes('error')) {
        console.log("Processing auth redirect...");
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return { user, setUser, theme, setTheme, isLoading };
};
