
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminUser } from "../components/AdminListTable";

/**
 * Hook to fetch and store admin users with their email, from
 * both 'profiles' and auth user tables.
 */
export const useAdminList = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, employee_id, created_at")
        .eq("role", "admin")
        .order("created_at", { ascending: true });

      if (profilesError) throw profilesError;

      if (profilesData && profilesData.length > 0) {
        // For each admin, fetch the email address from auth.users
        const adminList: AdminUser[] = await Promise.all(
          profilesData.map(async (profile: any): Promise<AdminUser> => {
            try {
              const { data: userData } = await supabase.auth.admin.getUserById(
                profile.id
              );
              let email = "Email unavailable";
              if (
                userData &&
                userData.user &&
                typeof userData.user.email === "string"
              ) {
                email = userData.user.email;
              }
              return {
                id: profile.id,
                name: profile.name,
                email,
                employee_id: profile.employee_id ?? null,
                created_at: profile.created_at,
              };
            } catch {
              // In case of error, always return the AdminUser with 'Email unavailable'
              return {
                id: profile.id,
                name: profile.name,
                email: "Email unavailable",
                employee_id: profile.employee_id ?? null,
                created_at: profile.created_at,
              };
            }
          })
        );
        setAdmins(adminList);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admin users");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { admins, isLoading, fetchAdmins };
};
