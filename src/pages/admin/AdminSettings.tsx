
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoaderCircle, UserPlus, Settings } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  employee_id: string | null;
  created_at: string;
}

const AdminSettings = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmployeeId, setNewAdminEmployeeId] = useState('');
  const [existingUserId, setExistingUserId] = useState('');
  const [existingUserEmployeeId, setExistingUserEmployeeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if not authenticated or not admin, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchAdmins();
  }, [isAuthenticated, isAdmin, navigate]);

  // Check if current user is the main admin
  useEffect(() => {
    if (user?.email === "saikushalulli@gmail.com") {
      setIsMainAdmin(true);
    }
  }, [user]);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      // Fetch all profiles with 'admin' role
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, employee_id, created_at')
        .eq('role', 'admin')
        .order('created_at', { ascending: true });

      if (profilesError) throw profilesError;

      if (profilesData && profilesData.length > 0) {
        // For each admin, fetch the email address from auth.users
        const adminList: AdminUser[] = await Promise.all(
          profilesData.map(async (profile): Promise<AdminUser> => {
            try {
              const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
                profile.id
              );

              let email = 'Email unavailable';
              if (userData && userData.user && typeof userData.user.email === 'string') {
                email = userData.user.email;
              }

              return {
                id: profile.id,
                name: profile.name,
                email,
                employee_id: profile.employee_id ?? null,
                created_at: profile.created_at,
              };
            } catch (err) {
              // In case of error, always return the AdminUser with 'Email unavailable'
              return {
                id: profile.id,
                name: profile.name,
                email: 'Email unavailable',
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
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admin users');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteExistingUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMainAdmin) {
      toast.error('Only the main admin can promote users');
      return;
    }
    
    if (!existingUserId || !existingUserEmployeeId) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          employee_id: existingUserEmployeeId 
        })
        .eq('id', existingUserId);
        
      if (error) throw error;
      
      toast.success('User successfully promoted to admin');
      setExistingUserId('');
      setExistingUserEmployeeId('');
      fetchAdmins();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user to admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMainAdmin) {
      toast.error('Only the main admin can create new admin users');
      return;
    }
    
    if (!newAdminEmail || !newAdminName || !newAdminEmployeeId) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random password for initial setup
      const password = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
      
      // Create the user account
      const { data, error } = await supabase.auth.admin.createUser({
        email: newAdminEmail,
        password,
        email_confirm: true,
        user_metadata: { name: newAdminName }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Update the profile with admin role and employee ID
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: 'admin',
            employee_id: newAdminEmployeeId
          })
          .eq('id', data.user.id);
          
        if (profileError) throw profileError;
        
        toast.success('New admin created successfully');
        setNewAdminEmail('');
        setNewAdminName('');
        setNewAdminEmployeeId('');
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold flex items-center">
            <Settings className="mr-2 h-6 w-6" />
            Admin Settings
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Administrators</CardTitle>
            <CardDescription>
              All administrators with system access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of admin users</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Added On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <LoaderCircle className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : admins.length > 0 ? (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.employee_id || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No administrators found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {isMainAdmin && (
            <CardFooter className="flex justify-end">
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
                      <h3 className="text-lg font-medium mb-4">
                        Promote Existing User
                      </h3>
                      <form onSubmit={handlePromoteExistingUser} className="space-y-4">
                        <div>
                          <label htmlFor="existingUserId" className="block text-sm font-medium mb-1">
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
                          <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
                            Employee ID
                          </label>
                          <Input 
                            id="employeeId" 
                            value={existingUserEmployeeId} 
                            onChange={(e) => setExistingUserEmployeeId(e.target.value)} 
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
                      <h3 className="text-lg font-medium mb-4">
                        Create New Admin
                      </h3>
                      <form onSubmit={handleCreateNewAdmin} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">
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
                          <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                          <label htmlFor="adminEmployeeId" className="block text-sm font-medium mb-1">
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
            </CardFooter>
          )}
        </Card>
        
        {/* Email Reminder Settings */}
        {isMainAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Email Reminder Settings</CardTitle>
              <CardDescription>
                Configure settings for automatic email reminders to unconfirmed users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="mb-4">
                  The system automatically sends reminder emails to users who haven't confirmed 
                  their email addresses. These reminders are sent once per day until the user 
                  confirms their email.
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <h4 className="font-medium mb-1 text-amber-800">How it works:</h4>
                  <ul className="list-disc list-inside space-y-1 text-amber-800">
                    <li>Reminders are sent to users who registered more than 24 hours ago</li>
                    <li>Only users with unconfirmed emails will receive reminders</li>
                    <li>The main admin is notified of all reminder emails sent</li>
                    <li>Reminders stop automatically once a user confirms their email</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
