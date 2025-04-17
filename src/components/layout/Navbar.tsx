
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, LayoutDashboard, User, LogOut, Menu,
  Moon, Sun, Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get first letter of name for avatar fallback
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className={`border-b border-border sticky top-0 z-30 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-purple-600">LearnFinity</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/courses" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:text-purple-600 hover:border-purple-500">
                <BookOpen className="mr-2 h-5 w-5" />
                Courses
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:text-purple-600 hover:border-purple-500">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:text-purple-600 hover:border-purple-500">
                  Admin
                </Link>
              )}
            </div>
          </div>
          
          {/* Desktop right side buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="rounded-full"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full p-1">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-purple-200">
                        {user?.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(user?.name || 'U')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/signup')}>Sign Up</Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 py-4">
                  <Link to="/" className="flex items-center">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                    <span className="ml-2 text-lg font-bold text-purple-600">LearnFinity</span>
                  </Link>
                  
                  {isAuthenticated && (
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="h-10 w-10">
                        {user?.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(user?.name || 'U')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm opacity-75">{user?.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-4">
                    <Link to="/courses" className="flex items-center px-2 py-2 text-base font-medium hover:text-purple-600">
                      <BookOpen className="mr-3 h-5 w-5" />
                      Courses
                    </Link>
                    
                    {isAuthenticated && (
                      <>
                        <Link to="/dashboard" className="flex items-center px-2 py-2 text-base font-medium hover:text-purple-600">
                          <LayoutDashboard className="mr-3 h-5 w-5" />
                          Dashboard
                        </Link>
                        
                        <Link to="/profile" className="flex items-center px-2 py-2 text-base font-medium hover:text-purple-600">
                          <User className="mr-3 h-5 w-5" />
                          Profile
                        </Link>
                        
                        {isAdmin && (
                          <Link to="/admin/dashboard" className="flex items-center px-2 py-2 text-base font-medium hover:text-purple-600">
                            Admin Panel
                          </Link>
                        )}
                        
                        <button 
                          onClick={handleLogout}
                          className="flex items-center px-2 py-2 text-base font-medium text-red-600"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Logout
                        </button>
                      </>
                    )}
                    
                    {!isAuthenticated && (
                      <div className="flex flex-col gap-2 mt-4">
                        <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/signup')}>Sign Up</Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
