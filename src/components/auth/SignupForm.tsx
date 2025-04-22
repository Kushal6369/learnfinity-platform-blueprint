import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, Eye, EyeOff, AlertCircle, Check, Mail, User, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    // Check password strength
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
        toast.success('Signup successful! Redirecting to dashboard...');
        // Redirect to dashboard after short delay for toast visibility
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (!success) {
        setIsLoading(false);
      }
      // No need for redirection here as it's handled by the OAuth flow
    } catch (error) {
      console.error('Google signup error:', error);
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (password && value) {
      if (password !== value) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };
  
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
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
        
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock size={16} /> Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:border-purple-600 pr-10 transition-all duration-200"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {password && (
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
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <Lock size={16} /> Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className={cn(
                "focus:border-purple-600 pr-10 transition-all duration-200",
                confirmPassword && password === confirmPassword ? "border-green-500" : ""
              )}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            
            {confirmPassword && password === confirmPassword && (
              <Check size={18} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {passwordError && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1 animate-fade-in">
              <AlertCircle size={14} />
              {passwordError}
            </p>
          )}
        </div>
        
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

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.4-5.7,8-11.3,8c-6.8,0-12-5.2-12-12s5.2-12,12-12c3.1,0,5.9,1.1,8,2.9l6.1-6.1C33.9,3.4,29.1,2,24,2C12.9,2,4,11,4,22s8.9,20,20,20s20-9,20-20c0-0.7,0-1.3-0.1-2H43.6z"/>
            <path fill="#FF3D00" d="M6.3,13.7L12.9,18.5c1.8-4.4,5.9-7.5,11.1-7.5c3.1,0,5.9,1.1,8,2.9l6.1-6.1C33.9,3.4,29.1,2,24,2C16.3,2,9.7,6.7,6.3,13.7z"/>
            <path fill="#4CAF50" d="M24,42c5,0,9.6-1.3,13.5-3.7l-6.6-5.5c-1.8,1.2-4,1.9-6.9,1.9c-5.6,0-10.4-3.6-12.1-9l-6.8,5.3C8.4,37.6,15.6,42,24,42z"/>
            <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.4-1.7,4.5-3.5,6l6.6,5.5C42.4,35.2,44,29,44,22C44,21.3,43.9,20.7,43.6,20z"/>
          </svg>
          Sign up with Google
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
