
import React from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

interface GoogleSignupButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

const GoogleSignupButton: React.FC<GoogleSignupButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      onClick={onClick}
      disabled={isLoading}
    >
      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.4-5.7,8-11.3,8c-6.8,0-12-5.2-12-12s5.2-12,12-12c3.1,0,5.9,1.1,8,2.9l6.1-6.1C33.9,3.4,29.1,2,24,2C12.9,2,4,11,4,22s8.9,20,20,20s20-9,20-20c0-0.7,0-1.3-0.1-2H43.6z"/>
        <path fill="#FF3D00" d="M6.3,13.7L12.9,18.5c1.8-4.4,5.9-7.5,11.1-7.5c3.1,0,5.9,1.1,8,2.9l6.1-6.1C33.9,3.4,29.1,2,24,2C16.3,2,9.7,6.7,6.3,13.7z"/>
        <path fill="#4CAF50" d="M24,42c5,0,9.6-1.3,13.5-3.7l-6.6-5.5c-1.8,1.2-4,1.9-6.9,1.9c-5.6,0-10.4-3.6-12.1-9l-6.8,5.3C8.4,37.6,15.6,42,24,42z"/>
        <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.4-1.7,4.5-3.5,6l6.6,5.5C42.4,35.2,44,29,44,22C44,21.3,43.9,20.7,43.6,20z"/>
      </svg>
      {isLoading ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Signing up...
        </>
      ) : (
        'Sign up with Google'
      )}
    </Button>
  );
};

export default GoogleSignupButton;
