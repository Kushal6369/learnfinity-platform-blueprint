
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, BookOpen, CheckSquare, 
  Award, Settings, LogOut, BarChart, PlusSquare, 
  Users, Database 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const SidebarLink = ({ to, icon: Icon, children, className }: {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "sidebar-link group",
        isActive ? "bg-gray-800 text-white" : "text-gray-400",
        className
      )}
    >
      <Icon className="sidebar-icon" />
      <span className="menu-label whitespace-nowrap">{children}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { isAdmin, logout } = useAuth();
  const isAdminPath = useLocation().pathname.startsWith('/admin');
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <div className="menu shadow-xl">
      <div className="sticky top-0 py-6">
        <h2 className="px-4 mb-8 text-white font-semibold transition-all duration-300">
          <span className="menu-label">{isAdminPath ? 'Admin Panel' : 'LearnFinity'}</span>
        </h2>
        
        <nav className="menu-content space-y-1">
          {isAdminPath ? (
            <>
              <SidebarLink to="/admin/dashboard" icon={BarChart}>Dashboard</SidebarLink>
              <SidebarLink to="/admin/courses" icon={BookOpen}>Courses</SidebarLink>
              <SidebarLink to="/admin/course-management" icon={PlusSquare}>Course Management</SidebarLink>
              <SidebarLink to="/admin/users" icon={Users}>Users</SidebarLink>
              <SidebarLink to="/admin/settings" icon={Settings}>Settings</SidebarLink>
              <SidebarLink to="/admin/reports" icon={Database}>Reports</SidebarLink>
              <div className="pt-4 mt-4 border-t border-gray-700">
                <SidebarLink to="/dashboard" icon={LayoutDashboard} className="text-blue-400 hover:text-blue-300">
                  Switch to Student View
                </SidebarLink>
              </div>
            </>
          ) : (
            <>
              <SidebarLink to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>
              <SidebarLink to="/courses" icon={BookOpen}>Courses</SidebarLink>
              <SidebarLink to="/assignments" icon={CheckSquare}>Assignments</SidebarLink>
              <SidebarLink to="/certificates" icon={Award}>Certificates</SidebarLink>
              <SidebarLink to="/settings" icon={Settings}>Settings</SidebarLink>
              
              {isAdmin && (
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <SidebarLink to="/admin/dashboard" icon={BarChart} className="text-blue-400 hover:text-blue-300">
                    Switch to Admin View
                  </SidebarLink>
                </div>
              )}
            </>
          )}
          
          <div className="absolute bottom-8 left-0 right-0 px-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-r-full transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 group"
            >
              <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
              <span className="menu-label">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
