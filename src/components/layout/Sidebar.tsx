
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, BookOpen, CheckSquare, 
  Award, Settings, LogOut, BarChart, PlusSquare, Users, Database
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
        'flex items-center px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-300',
        'hover:bg-gray-800 hover:text-white group',
        isActive ? 'bg-gray-800 text-white' : 'text-gray-400',
        className
      )}
    >
      <Icon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
      <span className="opacity-100 transition-opacity duration-300">
        {children}
      </span>
    </Link>
  );
};

const Sidebar = () => {
  const { isAdmin, logout } = useAuth();
  const isAdminPath = useLocation().pathname.startsWith('/admin');
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div 
      className={cn(
        "menu min-h-screen bg-gray-900 text-white transition-all duration-300 shadow-xl relative",
        isExpanded ? "w-64" : "w-20",
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sticky top-0 py-6">
        <h2 className={cn(
          "text-lg font-semibold px-6 mb-8 transition-all duration-300",
          !isExpanded && "text-center px-0"
        )}>
          {isExpanded ? (isAdminPath ? 'Admin Panel' : 'LearnFinity') : 'LF'}
        </h2>
        
        <nav className="menu-content space-y-1 px-2">
          {isAdminPath ? (
            <>
              <SidebarLink to="/admin/dashboard" icon={BarChart}>
                {isExpanded ? "Dashboard" : ""}
              </SidebarLink>
              <SidebarLink to="/admin/courses" icon={BookOpen}>
                {isExpanded ? "Courses" : ""}
              </SidebarLink>
              <SidebarLink to="/admin/course-management" icon={PlusSquare}>
                {isExpanded ? "Course Management" : ""}
              </SidebarLink>
              <SidebarLink to="/admin/users" icon={Users}>
                {isExpanded ? "Users" : ""}
              </SidebarLink>
              <SidebarLink to="/admin/settings" icon={Settings}>
                {isExpanded ? "Settings" : ""}
              </SidebarLink>
              <SidebarLink to="/admin/reports" icon={Database}>
                {isExpanded ? "Reports" : ""}
              </SidebarLink>
              <div className="pt-4 mt-4 border-t border-gray-700">
                <SidebarLink to="/dashboard" icon={LayoutDashboard} className="text-blue-400 hover:text-blue-300">
                  {isExpanded ? "Switch to Student View" : ""}
                </SidebarLink>
              </div>
            </>
          ) : (
            <>
              <SidebarLink to="/dashboard" icon={LayoutDashboard}>
                {isExpanded ? "Dashboard" : ""}
              </SidebarLink>
              <SidebarLink to="/courses" icon={BookOpen}>
                {isExpanded ? "Courses" : ""}
              </SidebarLink>
              <SidebarLink to="/assignments" icon={CheckSquare}>
                {isExpanded ? "Assignments" : ""}
              </SidebarLink>
              <SidebarLink to="/certificates" icon={Award}>
                {isExpanded ? "Certificates" : ""}
              </SidebarLink>
              <SidebarLink to="/settings" icon={Settings}>
                {isExpanded ? "Settings" : ""}
              </SidebarLink>
              
              {isAdmin && (
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <SidebarLink to="/admin/dashboard" icon={BarChart} className="text-blue-400 hover:text-blue-300">
                    {isExpanded ? "Switch to Admin View" : ""}
                  </SidebarLink>
                </div>
              )}
            </>
          )}
          
          <div className="absolute bottom-8 left-0 right-0 px-2">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-r-full transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 group"
            >
              <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
              <span className={cn("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0")}>
                {isExpanded ? "Logout" : ""}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
