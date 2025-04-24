
import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: 'weak' | 'medium' | 'strong' | null;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  passwordStrength,
}) => {
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1 h-1">
        <div className={cn("flex-1 rounded-full transition-colors", 
          passwordStrength ? getPasswordStrengthColor() : "bg-gray-300")} />
        <div className={cn("flex-1 rounded-full transition-colors", 
          passwordStrength === 'medium' || passwordStrength === 'strong' 
            ? getPasswordStrengthColor() : "bg-gray-300")} />
        <div className={cn("flex-1 rounded-full transition-colors", 
          passwordStrength === 'strong' ? getPasswordStrengthColor() : "bg-gray-300")} />
      </div>
      <p className="text-xs text-gray-500">
        Password must be at least 6 characters with uppercase, lowercase, and number
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
