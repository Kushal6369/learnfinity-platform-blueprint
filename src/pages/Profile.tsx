
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ThemeToggle from '@/components/profile/ThemeToggle';
import ProfileForm from '@/components/profile/ProfileForm';

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
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const handleClearAvatar = () => {
    setAvatarUrl('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user?.name || '');
    setAvatarUrl(user?.avatar || '');
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
                <ProfileAvatar 
                  avatarUrl={avatarUrl}
                  name={name}
                  isEditing={isEditing}
                  onAvatarChange={handleAvatarChange}
                  onClearAvatar={handleClearAvatar}
                />
                
                <ThemeToggle theme={theme as 'light' | 'dark'} onToggleTheme={toggleTheme} />
              </div>
              
              {/* Profile details section */}
              <div className="flex-1">
                <ProfileForm 
                  user={user}
                  name={name}
                  setName={setName}
                  isEditing={isEditing}
                  isLoading={isLoading}
                  onCancel={handleCancel}
                  onSubmit={handleProfileUpdate}
                  setIsEditing={setIsEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
