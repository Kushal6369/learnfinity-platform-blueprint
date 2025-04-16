
import React from 'react';
import { Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <a href="/" className="flex items-center text-purple-600">
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">LearnFinity</span>
            </a>
          </div>
          <LoginForm />
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden md:block md:flex-1 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3')" }}>
        <div className="h-full w-full bg-purple-900/30 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md text-center p-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Welcome back to LearnFinity</h2>
            <p className="text-xl">Continue your learning journey and unlock your potential.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
