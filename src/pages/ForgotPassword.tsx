
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";

const ForgotPassword = () => {
  const { isAuthenticated, requestPasswordReset, verifyOTP, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await requestPasswordReset(email);
      if (success) {
        setStep('otp');
        toast.success("OTP sent to your email");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await verifyOTP(email, otp);
      if (success) {
        setStep('newPassword');
        toast.success("OTP verified successfully");
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await resetPassword(email, otp, newPassword);
      if (success) {
        toast.success("Password reset successfully");
        navigate('/login');
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
            
            <div className="text-center mt-4">
              <a 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Back to Login
              </a>
            </div>
          </form>
        );
        
      case 'otp':
        return (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="otp" className="text-white text-center block">
                Enter the 6-digit OTP sent to your email
              </Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="bg-gray-800 border-gray-700 text-white" />
                    <InputOTPSlot index={1} className="bg-gray-800 border-gray-700 text-white" />
                    <InputOTPSlot index={2} className="bg-gray-800 border-gray-700 text-white" />
                    <InputOTPSlot index={3} className="bg-gray-800 border-gray-700 text-white" />
                    <InputOTPSlot index={4} className="bg-gray-800 border-gray-700 text-white" />
                    <InputOTPSlot index={5} className="bg-gray-800 border-gray-700 text-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            
            <div className="text-center mt-4 flex justify-between">
              <button 
                type="button"
                onClick={() => setStep('email')} 
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => handleEmailSubmit(new Event('submit') as any)} 
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Resend OTP
              </button>
            </div>
          </form>
        );
        
      case 'newPassword':
        return (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white flex items-center gap-2">
                <Lock className="h-4 w-4" />
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
            
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => setStep('otp')} 
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Back
              </button>
            </div>
          </form>
        );
    }
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
              {step === 'email' && "Enter your email to receive an OTP"}
              {step === 'otp' && "Enter the verification code sent to your email"}
              {step === 'newPassword' && "Create a new password for your account"}
            </p>
          </div>
          
          {renderStepContent()}
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
