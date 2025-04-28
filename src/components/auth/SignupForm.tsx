
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import PasswordInput from './PasswordInput';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
    
    if (password || confirmPassword) {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must include uppercase, lowercase, and number');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    
    return validatePassword();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const success = await signup(name, email, password);
      if (success) {
        toast.success('Signup successful! Please check your email to confirm your account.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User size={16} /> Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="focus:border-purple-600 transition-all duration-200"
            autoComplete="name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={16} /> Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus:border-purple-600 transition-all duration-200"
            autoComplete="email"
          />
        </div>
        
        <PasswordInput
          id="password"
          password={password}
          setPassword={setPassword}
          label="Password"
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          passwordStrength={passwordStrength}
        />
        
        <PasswordInput
          id="confirmPassword"
          password={confirmPassword}
          setPassword={setConfirmPassword}
          label="Confirm Password"
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          error={passwordError}
          isConfirm={true}
          confirmPassword={password}
        />
        
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-medium transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
