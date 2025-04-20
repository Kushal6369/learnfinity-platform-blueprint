
import React from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/auth';

interface ProfileFormProps {
  user: User | null;
  name: string;
  setName: (name: string) => void;
  isEditing: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  setIsEditing: (isEditing: boolean) => void;
}

const ProfileForm = ({
  user,
  name,
  setName,
  isEditing,
  isLoading,
  onCancel,
  onSubmit,
  setIsEditing
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
              onClick={onCancel}
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
  );
};

export default ProfileForm;
