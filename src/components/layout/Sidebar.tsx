
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Book, 
  BookOpen, 
  Settings,
  Layout,
  FolderPlus,
  Users,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  const isActiveRoute = (path: string) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <div className="menu shadow-xl w-64 bg-background h-screen">
      <div className="sticky top-0 py-6">
        <h2 className="px-4 mb-8 text-foreground font-semibold transition-all duration-300">
          <span className="menu-label">Swift Study</span>
        </h2>

        <nav className="space-y-2 px-2">
          <Link to="/dashboard">
            <Button 
              variant={isActiveRoute('/dashboard') ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link to="/courses">
            <Button 
              variant={isActiveRoute('/courses') ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <Book className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
          </Link>

          <Link to="/my-courses">
            <Button 
              variant={isActiveRoute('/my-courses') ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              My Courses
            </Button>
          </Link>

          <Link to="/chatbot">
            <Button 
              variant={isActiveRoute('/chatbot') ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Study Assistant
            </Button>
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin/dashboard">
                <Button 
                  variant={isActiveRoute('/admin/dashboard') ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>

              <Link to="/admin/course-management">
                <Button 
                  variant={isActiveRoute('/admin/course-management') ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Course Management
                </Button>
              </Link>

              <Link to="/admin/settings">
                <Button 
                  variant={isActiveRoute('/admin/settings') ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Settings
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
