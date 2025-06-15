
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
  MessageSquare,
  FileText,
  File,
  Edit,
  User,
  File as QuizIcon,
  FileText as CertificateIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const isActiveRoute = (path: string) => location.pathname === path;

  if (!isAuthenticated) return null;

  if (isAdmin) {
    // Admin Sidebar
    return (
      <div className="menu shadow-xl w-64 bg-background h-screen">
        <div className="sticky top-0 py-6">
          <h2 className="px-4 mb-8 text-foreground font-semibold transition-all duration-300">
            <span className="menu-label">Swift Study (Admin)</span>
          </h2>
          <nav className="space-y-2 px-2">
            <Link to="/admin/dashboard">
              <Button variant={isActiveRoute('/admin/dashboard') ? "secondary" : "ghost"} className="w-full justify-start"><Layout className="mr-2 h-4 w-4" /> Admin Dashboard</Button>
            </Link>
            <Link to="/admin/course-management">
              <Button variant={isActiveRoute('/admin/course-management') ? "secondary" : "ghost"} className="w-full justify-start"><FolderPlus className="mr-2 h-4 w-4" /> Course Management</Button>
            </Link>
            <Link to="/admin/upload-material">
              <Button variant={isActiveRoute('/admin/upload-material') ? "secondary" : "ghost"} className="w-full justify-start"><FileText className="mr-2 h-4 w-4" /> Upload Material</Button>
            </Link>
            <Link to="/admin/generate-quiz">
              <Button variant={isActiveRoute('/admin/generate-quiz') ? "secondary" : "ghost"} className="w-full justify-start"><QuizIcon className="mr-2 h-4 w-4" /> Add/Generate Quizzes</Button>
            </Link>
            <Link to="/admin/students">
              <Button variant={isActiveRoute('/admin/students') ? "secondary" : "ghost"} className="w-full justify-start"><Users className="mr-2 h-4 w-4" /> Student Overview</Button>
            </Link>
            <Link to="/admin/edit-certificate-template">
              <Button variant={isActiveRoute('/admin/edit-certificate-template') ? "secondary" : "ghost"} className="w-full justify-start"><Edit className="mr-2 h-4 w-4" /> Edit Certificate Template</Button>
            </Link>
            <Link to="/chatbot">
              <Button variant={isActiveRoute('/chatbot') ? "secondary" : "ghost"} className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" /> AI Chatbot Page</Button>
            </Link>
          </nav>
        </div>
      </div>
    );
  }

  // Student Sidebar
  return (
    <div className="menu shadow-xl w-64 bg-background h-screen">
      <div className="sticky top-0 py-6">
        <h2 className="px-4 mb-8 text-foreground font-semibold transition-all duration-300">
          <span className="menu-label">Swift Study (Student)</span>
        </h2>
        <nav className="space-y-2 px-2">
          <Link to="/dashboard">
            <Button variant={isActiveRoute('/dashboard') ? "secondary" : "ghost"} className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant={isActiveRoute('/courses') ? "secondary" : "ghost"} className="w-full justify-start">
              <Book className="mr-2 h-4 w-4" /> Courses
            </Button>
          </Link>
          <Link to="/quiz">
            <Button variant={isActiveRoute('/quiz') ? "secondary" : "ghost"} className="w-full justify-start">
              <QuizIcon className="mr-2 h-4 w-4" /> Quiz
            </Button>
          </Link>
          <Link to="/certificate-generator">
            <Button variant={isActiveRoute('/certificate-generator') ? "secondary" : "ghost"} className="w-full justify-start">
              <CertificateIcon className="mr-2 h-4 w-4" /> Certificate Generator
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant={isActiveRoute('/profile') ? "secondary" : "ghost"} className="w-full justify-start">
              <User className="mr-2 h-4 w-4" /> Profile
            </Button>
          </Link>
          <Link to="/chatbot">
            <Button variant={isActiveRoute('/chatbot') ? "secondary" : "ghost"} className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" /> AI Chatbot Page
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
