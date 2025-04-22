
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Signup = () => {
  const { isAuthenticated, theme } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Add a subtle entrance animation for the page
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      document.body.classList.remove('overflow-hidden');
    }, 600);
  }, [isAuthenticated, navigate]);
  
  // Prevent flash of signup form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen flex flex-col md:flex-row animate-fade-in">
      {/* Left side - Image with improved loading and fallback */}
      <div className="hidden md:block md:flex-1 relative overflow-hidden">
        {/* Fallback background color while image loads */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isDark ? "bg-purple-900" : "bg-purple-700"
        )}></div>
        
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 animate-[fadeIn_1.2s_ease-out_forwards]" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3')", animationDelay: "300ms" }}
        >
          <div className={cn(
            "h-full w-full backdrop-blur-sm flex items-center justify-center",
            isDark ? "bg-purple-900/30" : "bg-purple-700/30"
          )}>
            <div className="max-w-md text-center p-6 text-white animate-[slideIn_1s_ease-out_forwards]" style={{ animationDelay: "600ms", opacity: 0 }}>
              <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Join LearnFinity Today</h2>
              <p className="text-xl drop-shadow">Start your learning journey and unlock unlimited knowledge.</p>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline" 
                className="mt-8 border-white/30 bg-white/10 hover:bg-white/20 text-white"
              >
                Already have an account?
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className={cn(
        "flex-1 flex items-center justify-center p-6 md:p-10 transition-colors duration-300",
        isDark ? "bg-gray-900" : "bg-gray-50"
      )}>
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <a href="/" className={cn(
              "flex items-center",
              isDark ? "text-purple-400" : "text-purple-600"
            )}>
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
