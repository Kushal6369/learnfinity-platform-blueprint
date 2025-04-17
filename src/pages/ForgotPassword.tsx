
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

const ForgotPassword = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [isRequestSent, setIsRequestSent] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual password reset logic when Supabase is connected
    setIsRequestSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <a href="/" className="flex items-center text-purple-400">
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">LearnFinity</span>
            </a>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-gray-400 mt-2">
              {!isRequestSent 
                ? "Enter your email to reset your password" 
                : "Password reset instructions sent"}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isRequestSent ? (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Lock className="h-12 w-12 mx-auto text-purple-400" />
                <p className="text-gray-300">
                  We've sent password reset instructions to your email.
                </p>
              </div>
            )}
            
            {!isRequestSent && (
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              >
                Reset Password
              </Button>
            )}
            
            <div className="text-center mt-4">
              <a 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div 
        className="hidden md:block md:flex-1 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3')" }}
      >
        <div className="h-full w-full bg-purple-900/70 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md text-center p-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Forgot Your Password?</h2>
            <p className="text-xl">Don't worry, we'll help you reset it and get back to learning.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
