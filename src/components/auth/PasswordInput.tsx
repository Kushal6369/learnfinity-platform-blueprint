
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface PasswordInputProps {
  id: string;
  password: string;
  setPassword: (value: string) => void;
  label: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
  error?: string;
  isConfirm?: boolean;
  confirmPassword?: string;
  passwordStrength?: 'weak' | 'medium' | 'strong' | null;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  password,
  setPassword,
  label,
  showPassword,
  toggleShowPassword,
  error,
  isConfirm = false,
  confirmPassword,
  passwordStrength,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Lock size={16} /> {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={cn(
            "focus:border-purple-600 pr-10 transition-all duration-200",
            isConfirm && confirmPassword && password === confirmPassword ? "border-green-500" : ""
          )}
          autoComplete={isConfirm ? "new-password" : "current-password"}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        
        {isConfirm && confirmPassword && password === confirmPassword && (
          <Check size={18} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
        )}
      </div>
      
      {!isConfirm && passwordStrength !== undefined && (
        <PasswordStrengthIndicator
          password={password}
          passwordStrength={passwordStrength}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-1 animate-fade-in">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
