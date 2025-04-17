
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Theme type
type Theme = 'light' | 'dark';

// User type
type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  theme: Theme;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  theme: Theme;
  login: (email: string, password: string, employeeId?: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  toggleTheme: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demonstration (would come from an API in a real app)
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password',
    role: 'user' as const,
    avatar: 'https://i.pravatar.cc/150?img=1',
    theme: 'light' as Theme,
    employeeId: ''
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin' as const,
    avatar: 'https://i.pravatar.cc/150?img=2',
    theme: 'dark' as Theme,
    employeeId: 'ADMIN123'
  }
];

// Mock OTP storage
const mockOtps: Record<string, { otp: string, timestamp: number }> = {};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setTheme(parsedUser.theme);
      } catch (error) {
        console.error('Failed to parse stored user', error);
      }
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    
    // Update user's theme preference if logged in
    if (user) {
      setUser({...user, theme});
      localStorage.setItem('user', JSON.stringify({...user, theme}));
    }
  }, [theme]);

  const login = async (email: string, password: string, employeeId?: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For admin login, require employeeId
      if (email.includes('admin')) {
        const adminUser = mockUsers.find(
          u => u.email === email && 
          u.password === password && 
          u.role === 'admin' && 
          u.employeeId === employeeId
        );
        
        if (!adminUser) {
          if (!employeeId) {
            toast.error('Employee ID is required for admin login');
          } else {
            toast.error('Invalid credentials or employee ID');
          }
          return false;
        }
        
        const { password: _, employeeId: __, ...adminUserWithoutPassword } = adminUser;
        setUser(adminUserWithoutPassword);
        setTheme(adminUserWithoutPassword.theme);
        localStorage.setItem('user', JSON.stringify(adminUserWithoutPassword));
        toast.success('Logged in successfully');
        return true;
      }
      
      // Regular user login
      const foundUser = mockUsers.find(u => u.email === email && u.password === password && u.role === 'user');
      
      if (foundUser) {
        const { password: _, employeeId: __, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setTheme(userWithoutPassword.theme);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        toast.success('Logged in successfully');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred while logging in');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = mockUsers.some(u => u.email === email);
      
      if (emailExists) {
        toast.error('Email already exists');
        return false;
      }
      
      // In a real app, we would create a new user in the database
      const newUser = {
        id: String(mockUsers.length + 1),
        name,
        email,
        role: 'user' as const,
        theme: theme as Theme
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred while creating your account');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  // Request password reset (generate and send OTP)
  const requestPasswordReset = async (email: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email exists
      const userExists = mockUsers.some(u => u.email === email);
      
      if (!userExists) {
        toast.error('Email not found');
        return false;
      }
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with timestamp (valid for 10 minutes)
      mockOtps[email] = {
        otp,
        timestamp: Date.now() + 10 * 60 * 1000 // 10 minutes
      };
      
      console.log(`OTP for ${email}: ${otp}`); // For testing purposes
      
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      return false;
    }
  };

  // Verify OTP
  const verifyOTP = async (email: string, otp: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const otpData = mockOtps[email];
      
      if (!otpData) {
        toast.error('No OTP request found for this email');
        return false;
      }
      
      if (Date.now() > otpData.timestamp) {
        toast.error('OTP has expired');
        delete mockOtps[email];
        return false;
      }
      
      if (otpData.otp !== otp) {
        toast.error('Invalid OTP');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  // Reset password
  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify OTP again
      const isValid = await verifyOTP(email, otp);
      
      if (!isValid) {
        return false;
      }
      
      // Update user password (in a real app, this would update the database)
      const userIndex = mockUsers.findIndex(u => u.email === email);
      
      if (userIndex !== -1) {
        mockUsers[userIndex].password = newPassword;
        
        // Clear OTP data
        delete mockOtps[email];
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { 
          ...mockUsers[userIndex], 
          ...data 
        };
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      theme,
      login, 
      signup, 
      logout,
      requestPasswordReset,
      verifyOTP,
      resetPassword,
      toggleTheme,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
