
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoaderCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminManageSheetProps {
  isMainAdmin: boolean;
  fetchAdmins: () => void;
}

const AdminManageSheet: React.FC<AdminManageSheetProps> = ({
  isMainAdmin,
  fetchAdmins,
}) => {
  const [existingUserId, setExistingUserId] = useState("");
  const [existingUserEmployeeId, setExistingUserEmployeeId] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmployeeId, setNewAdminEmployeeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePromoteExistingUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainAdmin) {
      toast.error("Only the main admin can promote users");
      return;
    }
    if (!existingUserId || !existingUserEmployeeId) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          role: "admin",
          employee_id: existingUserEmployeeId,
        })
        .eq("id", existingUserId);

      if (error) throw error;
      toast.success("User successfully promoted to admin");
      setExistingUserId("");
      setExistingUserEmployeeId("");
      fetchAdmins();
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user to admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainAdmin) {
      toast.error("Only the main admin can create new admin users");
      return;
    }
    if (!newAdminEmail || !newAdminName || !newAdminEmployeeId) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      // Generate a random password for initial setup
      const password =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Create the user account
      const { data, error } = await supabase.auth.admin.createUser({
        email: newAdminEmail,
        password,
        email_confirm: true,
        user_metadata: { name: newAdminName },
      });

      if (error) throw error;

      if (data.user) {
        // Update the profile with admin role and employee ID
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: "admin",
            employee_id: newAdminEmployeeId,
          })
          .eq("id", data.user.id);

        if (profileError) throw profileError;

        toast.success("New admin created successfully");
        setNewAdminEmail("");
        setNewAdminName("");
        setNewAdminEmployeeId("");
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("Failed to create admin user");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMainAdmin) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Administrator</SheetTitle>
          <SheetDescription>
            Create a new admin account or promote an existing user
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Promote existing user */}
          <div>
            <h3 className="text-lg font-medium mb-4">Promote Existing User</h3>
            <form
              onSubmit={handlePromoteExistingUser}
              className="space-y-4"
              autoComplete="off"
            >
              <div>
                <label
                  htmlFor="existingUserId"
                  className="block text-sm font-medium mb-1"
                >
                  User ID
                </label>
                <Input
                  id="existingUserId"
                  value={existingUserId}
                  onChange={(e) => setExistingUserId(e.target.value)}
                  placeholder="User ID"
                />
              </div>
              <div>
                <label
                  htmlFor="employeeId"
                  className="block text-sm font-medium mb-1"
                >
                  Employee ID
                </label>
                <Input
                  id="employeeId"
                  value={existingUserEmployeeId}
                  onChange={(e) =>
                    setExistingUserEmployeeId(e.target.value)
                  }
                  placeholder="e.g. EMP12345"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Promote to Admin
              </Button>
            </form>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          {/* Create new admin */}
          <div>
            <h3 className="text-lg font-medium mb-4">Create New Admin</h3>
            <form
              onSubmit={handleCreateNewAdmin}
              className="space-y-4"
              autoComplete="off"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <Input
                  id="name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Admin's full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="adminEmployeeId"
                  className="block text-sm font-medium mb-1"
                >
                  Employee ID
                </label>
                <Input
                  id="adminEmployeeId"
                  value={newAdminEmployeeId}
                  onChange={(e) => setNewAdminEmployeeId(e.target.value)}
                  placeholder="e.g. EMP12345"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Create Admin
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminManageSheet;
