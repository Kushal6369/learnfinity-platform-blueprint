
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, IdCard, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate employee ID
    if (!employeeId.trim()) {
      toast.error('Employee ID is required for admin login');
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, you would pass the employeeId to the login function
      // For now, we'll just check for admin@example.com and ensure employeeId exists
      const success = await login(email, password);
      
      if (success && email === 'admin@example.com') {
        navigate('/admin/dashboard');
      } else if (success) {
        // If login successful but not admin email, show error
        toast.error('Invalid admin credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6 w-full max-w-md animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="text-white">Email</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-password" className="text-white">Password</Label>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              toast.info('Please contact your system administrator to reset your admin password');
            }} className="text-sm text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employee-id" className="text-white flex items-center gap-2">
            <IdCard className="h-4 w-4" />
            Employee ID
          </Label>
          <Input
            id="employee-id"
            type="text"
            placeholder="Enter your employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">Admin access requires a valid employee ID</p>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in as Admin'
          )}
        </Button>
      </form>
    </div>
  );
};

export default AdminLoginForm;
