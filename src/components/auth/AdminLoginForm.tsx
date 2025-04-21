
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Badge, Eye, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!employeeId.trim()) {
        toast.error('Employee ID is required');
        setIsLoading(false);
        return;
      }

      const success = await login(email, password, employeeId);
      if (success) {
        toast.success('Admin login successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert variant="default" className="bg-purple-900/30 border-purple-800 text-gray-200 mb-4">
        <AlertDescription className="text-sm">
          This area is restricted to administrators only. You will need your employee ID to proceed.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="admin-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
        </Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="admin-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500 pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="employee-id" className="flex items-center gap-2">
            <Badge className="h-4 w-4" />
            Employee ID
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                <p>For demo, use: RA2211003011971</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="employee-id"
          type="text"
          placeholder="Example: RA2211003011971"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500"
          aria-describedby="employeeId-format"
        />
        <p id="employeeId-format" className="text-xs text-gray-400">
          Enter your unique administrator employee ID
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Admin Sign In'}
      </Button>

      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors block mb-2">
          Forgot password or employee ID?
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
          Back to Home
        </Link>
      </div>
    </form>
  );
};

export default AdminLoginForm;
