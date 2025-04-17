
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!employeeId.trim()) {
        toast.error('Employee ID is required');
        return;
      }

      const success = await login(email, password, employeeId);
      if (success) {
        navigate('/admin/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="admin-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <Input
          id="admin-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employee-id" className="flex items-center gap-2">
          <Badge className="h-4 w-4" />
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
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
