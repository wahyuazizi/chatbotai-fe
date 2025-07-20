"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null; // Tambahkan role
  login: (token: string, role: string) => void; // Perbarui signature login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null); // Tambahkan state role
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Baca role dari localStorage
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole); // Set role
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  const login = (token: string, userRole: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole); // Simpan role di localStorage
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Hapus role dari localStorage
    setIsAuthenticated(false);
    setRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
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