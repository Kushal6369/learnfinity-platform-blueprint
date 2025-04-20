
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { Separator } from '@/components/ui/separator';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const isAdminEmail = email === 'saikushalulli@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, isAdminEmail ? employeeId : undefined);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('An error occurred during Google login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>
      
      {isAdminEmail && (
        <div className="space-y-2">
          <Label htmlFor="employeeId" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Employee ID
          </Label>
          <Input
            id="employeeId"
            type="text"
            placeholder="Enter employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required={isAdminEmail}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
        </div>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full border-gray-700 text-white hover:bg-gray-800"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.4-5.7,8-11.3,8c-6.8,0-12-5.2-12-12s5.2-12,12-12c3.1,0,5.9,1.1,8,2.9l6.1-6.1C33.9,3.4,29.1,2,24,2C12.9,2,4,11,4,22s8.9,20,20,20s20-9,20-20c0-0.7,0-1.3-0.1-2H43.6z"/>
          <path fill="#FF3D00" d="M6.3,13.7L12.9,18.5c1.8-4.4,5.9-7.5,11.1-7.5c3.1,0,5.9,1.1,8,2.9l6.1-6.1C33.9,3.4,29.1,2,24,2C16.3,2,9.7,6.7,6.3,13.7z"/>
          <path fill="#4CAF50" d="M24,42c5,0,9.6-1.3,13.5-3.7l-6.6-5.5c-1.8,1.2-4,1.9-6.9,1.9c-5.6,0-10.4-3.6-12.1-9l-6.8,5.3C8.4,37.6,15.6,42,24,42z"/>
          <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.4-1.7,4.5-3.5,6l6.6,5.5C42.4,35.2,44,29,44,22C44,21.3,43.9,20.7,43.6,20z"/>
        </svg>
        Sign in with Google
      </Button>
      
      <p className="text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-400 hover:text-blue-300">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
