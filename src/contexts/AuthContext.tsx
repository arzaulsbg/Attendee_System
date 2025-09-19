import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  facultyId?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('attendance_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt),
          lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('attendance_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - replace with Firebase Auth
      const mockUser: User = {
        id: '1',
        email,
        name: 'Demo User',
        role: email.includes('admin') ? 'admin' : email.includes('faculty') ? 'faculty' : 'student',
        department: 'Computer Science',
        studentId: email.includes('student') ? 'CS2024001' : undefined,
        facultyId: email.includes('faculty') ? 'FAC001' : undefined,
        phone: '+1234567890',
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('attendance_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      // Mock registration - replace with Firebase Auth
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('attendance_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('attendance_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};