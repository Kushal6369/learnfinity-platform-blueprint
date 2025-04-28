
export type Theme = 'light' | 'dark';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  theme: Theme;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  theme: Theme;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  updateProfile: (data: { name: string; avatar?: string }) => Promise<boolean>;
};
