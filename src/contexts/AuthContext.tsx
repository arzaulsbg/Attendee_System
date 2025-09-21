import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

export interface AuthContextType {
  user: Partial<User> | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role: import("@/types/auth").UserRole; department?: string; studentId?: string; facultyId?: string; phone?: string; faceImageUrl?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
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
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(false);
  // Remove token state, not needed for Firebase

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email || '',
          role: undefined, // You may want to fetch custom claims or Firestore user doc for role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email || '',
        role: undefined, // You may want to fetch custom claims or Firestore user doc for role
      });
    } catch (error: any) {
      setUser(null);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    signOut(auth).then(() => setUser(null));
  };

  const register = async (data: { email: string; password: string; name: string; role: import("@/types/auth").UserRole; department?: string; studentId?: string; facultyId?: string; phone?: string; faceImageUrl?: string }) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: data.name,
        role: data.role,
        department: data.department,
        studentId: data.studentId,
        facultyId: data.facultyId,
        phone: data.phone,
        faceImageUrl: data.faceImageUrl,
      });
      // Optionally, save extra user info to Firestore here
    } catch (error: any) {
      setUser(null);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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