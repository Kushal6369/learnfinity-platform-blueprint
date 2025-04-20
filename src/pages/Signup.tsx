
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/context/AuthContext';

const Signup = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Prevent flash of signup form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:block md:flex-1 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3')" }}>
        <div className="h-full w-full bg-purple-900/30 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md text-center p-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Join LearnFinity Today</h2>
            <p className="text-xl">Start your learning journey and unlock unlimited knowledge.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <a href="/" className="flex items-center text-purple-600">
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">LearnFinity</span>
            </a>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
