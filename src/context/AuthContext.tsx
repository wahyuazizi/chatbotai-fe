"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let instanceCount = 0;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const instanceId = useRef(instanceCount++).current;

  console.log(`AuthContext Instance ${instanceId}: Rendered.`);

  useEffect(() => {
    console.log(`AuthContext Instance ${instanceId}: Initializing auth state...`);
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
      console.log(`AuthContext Instance ${instanceId}: User authenticated. Role:`, userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
      console.log(`AuthContext Instance ${instanceId}: User not authenticated.`);
    }
    setLoading(false);
    console.log(`AuthContext Instance ${instanceId}: Loading complete.`);

    return () => {
      console.log(`AuthContext Instance ${instanceId}: Unmounting.`);
    };
  }, []);

  const login = (token: string, userRole: string) => {
    console.log(`AuthContext Instance ${instanceId}: Login function called.`);
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    setIsAuthenticated(true);
    setRole(userRole);
    console.log(`AuthContext Instance ${instanceId}: Token and role set in localStorage. State updated.`);
    // Redirect after login
    const redirectTo = userRole === 'admin' ? '/admin' : '/chat';
    console.log(`AuthContext Instance ${instanceId}: Login successful. Redirecting to ${redirectTo}`);
    router.push(redirectTo);
  };

  const logout = () => {
    console.log(`AuthContext Instance ${instanceId}: Logout function called.`);
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Reset state
    setIsAuthenticated(false);
    setRole(null);
    // Use window.location.href for full reload
    console.log(`AuthContext Instance ${instanceId}: All localStorage items cleared.`);
    console.log(`AuthContext Instance ${instanceId}: localStorage token after clear:`, localStorage.getItem('token'));
    console.log(`AuthContext Instance ${instanceId}: localStorage role after clear:`, localStorage.getItem('role'));
    console.log(`AuthContext Instance ${instanceId}: Forcing full page reload to /login.`);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
