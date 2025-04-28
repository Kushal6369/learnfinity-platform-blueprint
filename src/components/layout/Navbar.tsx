import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Moon, Sun, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Navbar = () => {
  const {
    user,
    theme,
    toggleTheme,
    logout,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return <nav className={`border-b border-border sticky top-0 z-30 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-purple-600">swift Study</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            {!isAuthenticated ? <div className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div> : <>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0">
                      <Avatar className="h-8 w-8 border border-purple-200">
                        {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(user?.name || 'U')}
                          </AvatarFallback>}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>}
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                  
                  {!isAuthenticated ? <div className="flex flex-col gap-2">
                      <Button variant="ghost" onClick={() => navigate('/login')}>
                        Login
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/signup')}>
                        Sign Up
                      </Button>
                    </div> : <>
                      <div className="flex items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                          {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : <AvatarFallback className="bg-purple-100 text-purple-600">
                              {getInitials(user?.name || 'U')}
                            </AvatarFallback>}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm opacity-75">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" onClick={() => navigate('/profile')}>
                          Profile
                        </Button>
                        <Button variant="ghost" onClick={handleLogout}>
                          Logout
                        </Button>
                      </div>
                    </>}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;