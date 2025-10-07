
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  mockLogin: (email: string) => void;
  mockLogout: () => void;
}

// Mock user data for demonstration
const createMockUser = (email: string): Partial<User> => ({
  uid: email.split('@')[0],
  email: email,
  displayName: email === 'admin@demo.com' ? 'Administrador Demo' : 
               email === 'joao.silva@futperformclub.pt' ? 'João Silva' : 'Utilizador Demo',
  photoURL: null,
  emailVerified: true
});

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  mockLogin: () => {}, 
  mockLogout: () => {} 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const mockLogin = (email: string) => {
    const mockUser = createMockUser(email) as User;
    setUser(mockUser);
    setIsUsingMock(true);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  const mockLogout = () => {
    setUser(null);
    setIsUsingMock(false);
    localStorage.removeItem('mockUser');
  };

  useEffect(() => {
    // Check for mock user in localStorage first
    const savedMockUser = localStorage.getItem('mockUser');
    if (savedMockUser) {
      try {
        const mockUser = JSON.parse(savedMockUser);
        setUser(mockUser);
        setIsUsingMock(true);
        setLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('mockUser');
      }
    }

    // Try real Firebase auth
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isUsingMock) {
          setUser(user);
        }
        setLoading(false);
      }, (error) => {
        console.warn('Firebase auth error, using mock mode:', error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Firebase not configured, using mock mode');
      setLoading(false);
    }
  }, [isUsingMock]);

  return (
    <AuthContext.Provider value={{ user, loading, mockLogin, mockLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
