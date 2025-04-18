
import { useState, useEffect } from 'react';
import { User, Theme } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

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
      } else {
        setUser(null);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
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
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, theme, setTheme };
};
