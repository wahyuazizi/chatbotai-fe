"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
=======
    console.log(`AuthContext Instance ${instanceId}: Initializing auth state with Supabase...`);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`AuthContext Instance ${instanceId}: Auth state changed:`, event, session);
>>>>>>> 8921421 (update chat hostory2)
=======
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
>>>>>>> 1eea4ea (update context)
      if (session) {
        setIsAuthenticated(true);
        const userRole = session.user?.user_metadata?.role || null;
        setRole(userRole);
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
<<<<<<< HEAD
<<<<<<< HEAD
=======
      console.log(`AuthContext Instance ${instanceId}: Unmounting and unsubscribing.`);
>>>>>>> 8921421 (update chat hostory2)
=======
>>>>>>> 1eea4ea (update context)
    };
  }, []);

  // Handle redirection based on auth state
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Redirect admin to /admin, but allow access to /chat
        if (role === 'admin' && pathname !== '/admin' && pathname !== '/chat') {
          router.push('/admin');
        } else if (role !== 'admin' && pathname !== '/chat') {
          router.push('/chat');
        }
      } else {
        // If not authenticated, redirect to login page, but not if already on public pages.
        const publicPages = ['/login', '/register', '/reset-password'];
        if (!publicPages.includes(pathname)) {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, role, loading, router, pathname]);

  const login = useCallback((token: string, userRole: string) => {
    // This function is mostly a placeholder as onAuthStateChange handles the logic.
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during Supabase logout:", error);
    }
    router.push('/login');
  }, [router]);

  const value = useMemo(() => ({
    isAuthenticated,
    role,
    loading,
    login,
    logout
  }), [isAuthenticated, role, loading, login, logout]);

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
