
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  User, Upload, Moon, Sun, Save, X, Camera, Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Toggle } from '@/components/ui/toggle';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAuthenticated, theme, toggleTheme, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatar || '');
    }
  }, [user]);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await updateProfile({
        name,
        avatar: avatarUrl
      });
      
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, this would upload to a storage service
    // For now, create a URL for the selected file
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const handleClearAvatar = () => {
    setAvatarUrl('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-card shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-40 w-40 rounded-full border-4 border-purple-500">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={name} />
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-4xl">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <label htmlFor="avatar-upload" className="cursor-pointer p-2 bg-white rounded-full">
                          <Camera className="h-6 w-6 text-purple-600" />
                          <input 
                            id="avatar-upload"
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleAvatarChange}
                          />
                        </label>
                        {avatarUrl && (
                          <button 
                            className="p-2 bg-white rounded-full"
                            onClick={handleClearAvatar}
                            type="button"
                          >
                            <Trash className="h-6 w-6 text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {theme === 'light' ? 'Light' : 'Dark'} Mode
                  </span>
                  <Toggle
                    aria-label="Toggle theme"
                    pressed={theme === 'dark'}
                    onPressedChange={toggleTheme}
                    className="border border-input"
                  >
                    {theme === 'light' ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Toggle>
                </div>
              </div>
              
              {/* Profile details section */}
              <div className="flex-1">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium leading-6">
                      Name
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing || isLoading}
                        className={!isEditing ? "bg-muted" : ""}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium leading-6">
                      Email
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled={true}
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="block text-sm font-medium leading-6">
                      Role
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="role"
                        type="text"
                        value={user?.role === 'admin' ? 'Administrator' : 'Student'}
                        disabled={true}
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    {!isEditing ? (
                      <Button 
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setName(user?.name || '');
                            setAvatarUrl(user?.avatar || '');
                          }}
                          disabled={isLoading}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={isLoading}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
