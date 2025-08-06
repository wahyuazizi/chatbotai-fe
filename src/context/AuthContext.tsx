"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  authToken: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (authToken?.startsWith('guest-')) return;

      if (session) {
        setIsAuthenticated(true);
        const userRole = session.user?.user_metadata?.role || null;
        setRole(userRole);
        setAuthToken(session.access_token);
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setAuthToken(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle redirection based on auth state
  useEffect(() => {
    if (!loading) {
      const publicPages = ['/login', '/register', '/reset-password'];
      // Normalize pathname to handle trailing slashes from next.config.js
      const normalizedPathname = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

      if (isAuthenticated) {
        // Admin user logic
        if (role === 'admin') {
          const allowedAdminPages = ['/admin', '/chat'];
          if (!allowedAdminPages.includes(normalizedPathname)) {
            router.push('/admin');
          }
        } 
        // Guest user logic
        else if (role === 'guest') {
          if (normalizedPathname !== '/chat') {
            router.push('/chat');
          }
        }
        // Non-admin (regular) user logic
        else {
          if (normalizedPathname !== '/chat') {
            router.push('/chat');
          }
        }
      } else {
        // Unauthenticated user logic
        if (!publicPages.includes(normalizedPathname)) {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, role, loading, router, pathname]);

  const login = useCallback((token: string, role: string) => {
    // This function is for manual login, like guest login
    setIsAuthenticated(true);
    setRole(role);
    setAuthToken(token);
  }, []);

  const logout = useCallback(async () => {
    const isGuest = authToken?.startsWith('guest-');

    if (isGuest) {
      setIsAuthenticated(false);
      setRole(null);
      setAuthToken(null);
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during Supabase logout:", error);
      }
      // onAuthStateChange will handle state reset for Supabase users
    }
  }, [authToken]);

  const value = useMemo(() => ({
    isAuthenticated,
    role,
    loading,
    authToken,
    login,
    logout
  }), [isAuthenticated, role, loading, authToken, login, logout]);

  return (
    <AuthContext.Provider value={value}>
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