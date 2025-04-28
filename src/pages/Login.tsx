import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { GraduationCap, Moon, Sun, Laptop } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Login = () => {
  const { isAuthenticated, theme: userTheme, toggleTheme } = useAuth();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(userTheme || 'dark');
  const [isLoading, setIsLoading] = useState(true);
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setLocalTheme(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setLocalTheme(theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const DemoAccountInfo = () => (
    <div className={cn(
      "mt-6 p-4 rounded-lg",
      localTheme === 'dark' ? "bg-gray-800/50" : "bg-gray-100"
    )}>
      <h3 className="text-sm font-medium mb-2">Demo Accounts</h3>
      {activeTab === 'user' ? (
        <div className="space-y-1 text-sm">
          <p>Email: <span className="font-mono">demo.user@learnfinity.com</span></p>
          <p>Password: <span className="font-mono">demo123</span></p>
        </div>
      ) : (
        <div className="space-y-1 text-sm">
          <p>Email: <span className="font-mono">demo.admin@learnfinity.com</span></p>
          <p>Password: <span className="font-mono">admin123</span></p>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen flex flex-col md:flex-row transition-colors duration-300",
      localTheme === 'dark' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    )}>
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className={cn(
              "flex items-center",
              localTheme === 'dark' ? "text-purple-400" : "text-purple-600"
            )}>
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">LearnFinity</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  "rounded-full",
                  localTheme === 'dark' ? "text-gray-300 hover:text-white hover:bg-gray-800" : 
                  "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                )}>
                  {localTheme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={cn(
                localTheme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white"
              )}>
                <DropdownMenuItem onClick={() => handleThemeChange('light')} className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('dark')} className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('system')} className="cursor-pointer">
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="text-center mb-8">
            <h1 className={cn(
              "text-3xl font-bold",
              localTheme === 'dark' ? "" : "text-gray-800"
            )}>Welcome Back</h1>
            <p className={cn(
              "mt-2",
              localTheme === 'dark' ? "text-gray-400" : "text-gray-600"
            )}>Sign in to your account to continue</p>
          </div>
          
          <div className={cn(
            "flex mb-6 rounded-lg p-1",
            localTheme === 'dark' ? "bg-gray-800" : "bg-gray-200"
          )}>
            <button
              onClick={() => setActiveTab('user')}
              className={cn(
                "flex-1 py-2 text-center rounded-md transition-all",
                activeTab === 'user' 
                  ? localTheme === 'dark' 
                    ? "bg-gray-700 text-white" 
                    : "bg-white text-gray-900 shadow-sm"
                  : localTheme === 'dark'
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              )}
              aria-pressed={activeTab === 'user'}
            >
              User Login
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "flex-1 py-2 text-center rounded-md transition-all",
                activeTab === 'admin' 
                  ? localTheme === 'dark' 
                    ? "bg-gray-700 text-white" 
                    : "bg-white text-gray-900 shadow-sm"
                  : localTheme === 'dark'
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              )}
              aria-pressed={activeTab === 'admin'}
            >
              Admin Login
            </button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              {activeTab === 'user' ? <LoginForm /> : <AdminLoginForm />}
              <DemoAccountInfo />
            </>
          )}
        </div>
      </div>
      
      <div className="hidden md:block md:flex-1 bg-cover bg-center relative">
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            {"opacity-0": isLoading}
          )}
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3')",
            transition: "opacity 0.5s ease-in-out"
          }}
        ></div>
        <div 
          className={cn(
            "absolute inset-0",
            localTheme === 'dark' ? "bg-purple-900/70" : "bg-purple-700/50",
            "backdrop-blur-sm flex items-center justify-center"
          )}
        >
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
