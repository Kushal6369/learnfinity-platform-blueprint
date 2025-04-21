
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminManageSheet from "./components/AdminManageSheet";
import AdminListTable from "./components/AdminListTable";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminList } from "./hooks/useAdminList";
import { Settings, Clock, Mail, AlertCircle, Save, Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const { admins, isLoading, fetchAdmins } = useAdminList();

  // Email reminder settings
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState("daily");
  const [reminderDays, setReminderDays] = useState(3);
  const [reminderHour, setReminderHour] = useState("09:00");
  const [saving, setSaving] = useState(false);

  // Session settings
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [enforceStrongPasswords, setEnforceStrongPasswords] = useState(true);

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

  const saveEmailSettings = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Email reminder settings saved successfully");
    }, 800);
  };

  const saveSecuritySettings = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Security settings saved successfully");
    }, 800);
  };

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
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Reminder Settings
                </CardTitle>
                <CardDescription>
                  Configure settings for automatic email reminders to unconfirmed users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="reminder-enabled" 
                    checked={reminderEnabled}
                    onCheckedChange={(checked) => setReminderEnabled(checked as boolean)} 
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor="reminder-enabled" 
                      className="font-medium cursor-pointer"
                    >
                      Enable email reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminder emails to users who haven't confirmed their email addresses
                    </p>
                  </div>
                </div>

                {reminderEnabled && (
                  <div className="space-y-4 pt-2">
                    <div className="grid gap-2">
                      <Label htmlFor="reminder-frequency">Reminder frequency</Label>
                      <Select 
                        value={reminderFrequency} 
                        onValueChange={setReminderFrequency}
                      >
                        <SelectTrigger id="reminder-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="reminder-days">
                          Days to send reminders
                        </Label>
                        <Input
                          id="reminder-days"
                          type="number"
                          min={1}
                          max={30}
                          value={reminderDays}
                          onChange={(e) => setReminderDays(parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Number of days to continue sending reminders
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="reminder-time">Time to send reminders</Label>
                        <Input
                          id="reminder-time"
                          type="time"
                          value={reminderHour}
                          onChange={(e) => setReminderHour(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          All times are in UTC
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        Email reminders are sent using the system email template. Changes to these settings may affect all automated emails.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={saveEmailSettings} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={saving}
                >
                  {saving ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Settings</>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure system security and session settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="session-timeout">Session timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      min={5}
                      max={120}
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Inactive users will be automatically logged out after this time
                    </p>
                  </div>
                
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="strong-passwords" 
                      checked={enforceStrongPasswords}
                      onCheckedChange={(checked) => setEnforceStrongPasswords(checked as boolean)} 
                    />
                    <div className="grid gap-1.5">
                      <Label 
                        htmlFor="strong-passwords" 
                        className="font-medium cursor-pointer"
                      >
                        Enforce strong passwords
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Require passwords to contain uppercase, lowercase, numbers, and special characters
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={saveSecuritySettings} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={saving}
                >
                  {saving ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Settings</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
