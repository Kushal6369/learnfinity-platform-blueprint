
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminManageSheet from "./components/AdminManageSheet";
import AdminListTable from "./components/AdminListTable";
import { useAdminList } from "./hooks/useAdminList";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const { admins, isLoading, fetchAdmins } = useAdminList();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchAdmins();
  }, [isAuthenticated, isAdmin, navigate, fetchAdmins]);

  useEffect(() => {
    if (user?.email === "saikushalulli@gmail.com") {
      setIsMainAdmin(true);
    }
  }, [user]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
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
            <AdminListTable admins={admins} isLoading={isLoading} />
          </CardContent>
          {isMainAdmin && (
            <CardFooter className="flex justify-end">
              <AdminManageSheet isMainAdmin={isMainAdmin} fetchAdmins={fetchAdmins} />
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
