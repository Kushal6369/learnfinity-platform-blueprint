
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, BookOpen, FileText, CheckSquare, 
  Award, Settings, Users, BarChart, PlusSquare, Database
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type SidebarLinkProps = {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
};

const SidebarLink = ({ to, icon: Icon, children, className }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
        isActive
          ? 'bg-purple-100 text-purple-700'
          : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50',
        className
      )}
    >
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Link>
  );
};

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const { isAdmin } = useAuth();
  const isAdminPath = useLocation().pathname.startsWith('/admin');
  
  return (
    <div className={cn('w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto', className)}>
      <div className="px-4 py-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 px-2">
          {isAdminPath ? 'Admin Panel' : 'Student Dashboard'}
        </h2>
        
        <nav className="space-y-1">
          {isAdminPath ? (
            // Admin sidebar links
            <>
              <SidebarLink to="/admin/dashboard" icon={BarChart}>Dashboard</SidebarLink>
              <SidebarLink to="/admin/courses" icon={BookOpen}>Courses</SidebarLink>
              <SidebarLink to="/admin/course-management" icon={PlusSquare}>Course Management</SidebarLink>
              <SidebarLink to="/admin/users" icon={Users}>Users</SidebarLink>
              <SidebarLink to="/admin/settings" icon={Settings}>Admin Settings</SidebarLink>
              <SidebarLink to="/admin/reports" icon={Database}>Reports</SidebarLink>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <SidebarLink to="/dashboard" icon={LayoutDashboard} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                  Switch to Student View
                </SidebarLink>
              </div>
            </>
          ) : (
            // Student sidebar links
            <>
              <SidebarLink to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>
              <SidebarLink to="/courses" icon={BookOpen}>Courses</SidebarLink>
              <SidebarLink to="/my-courses" icon={FileText}>My Courses</SidebarLink>
              <SidebarLink to="/assignments" icon={CheckSquare}>Assignments</SidebarLink>
              <SidebarLink to="/certificates" icon={Award}>Certificates</SidebarLink>
              <SidebarLink to="/settings" icon={Settings}>Settings</SidebarLink>
              
              {isAdmin && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <SidebarLink to="/admin/dashboard" icon={BarChart} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                    Switch to Admin View
                  </SidebarLink>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
