import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CourseDetail from "./pages/CourseDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import CourseManagement from "./pages/admin/CourseManagement";
import AddCourse from "./pages/admin/AddCourse";
import NotFound from "./pages/NotFound";
import Chatbot from "./pages/Chatbot";
import ChatbotWidget from "./components/chat/ChatbotWidget";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

// Component to conditionally render ChatbotWidget
const ChatbotWrapper = () => {
  const location = useLocation();
  const hideChatbotPaths = ['/login', '/signup'];
  
  if (hideChatbotPaths.includes(location.pathname)) {
    return null;
  }
  
  return <ChatbotWidget />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/course-management" element={<CourseManagement />} />
                <Route path="/admin/course/:id/edit" element={<EditCourse />} />
                <Route path="/admin/add-course" element={<AddCourse />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatbotWrapper />
            </Layout>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
