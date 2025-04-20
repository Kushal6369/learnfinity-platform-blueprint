
import React from 'react';
import { Camera, Trash } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl: string;
  name: string;
  isEditing: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAvatar: () => void;
}

const ProfileAvatar = ({ 
  avatarUrl, 
  name, 
  isEditing, 
  onAvatarChange, 
  onClearAvatar 
}: ProfileAvatarProps) => {
  return (
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
                onChange={onAvatarChange}
              />
            </label>
            {avatarUrl && (
              <button 
                className="p-2 bg-white rounded-full"
                onClick={onClearAvatar}
                type="button"
              >
                <Trash className="h-6 w-6 text-red-600" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
