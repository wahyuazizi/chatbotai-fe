"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from "@/lib/supabase";

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
    console.log(`AuthContext Instance ${instanceId}: Initializing auth state with Supabase...`);
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`AuthContext Instance ${instanceId}: Auth state changed:`, event, session);
      if (session) {
        setIsAuthenticated(true);
        // You might need to fetch user metadata or roles from your backend/database
        // For now, we'll assume role is part of user_metadata or fetched separately
        // If role is not directly in session, you'll need to adjust this.
        const userRole = session.user?.user_metadata?.role || null; // Adjust based on your Supabase setup
        setRole(userRole);
        console.log(`AuthContext Instance ${instanceId}: User authenticated. Role:`, userRole);
      } else {
        setIsAuthenticated(false);
        setRole(null);
        console.log(`AuthContext Instance ${instanceId}: User not authenticated.`);
      }
      setLoading(false);
    });

    return () => {
      authListener.unsubscribe();
      console.log(`AuthContext Instance ${instanceId}: Unmounting and unsubscribing.`);
    };
  }, []);

  // Handle redirection based on auth state
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        const redirectTo = (role === "admin" || role === "user") ? "/chat" : "/admin"; // Temporary: Allow admin to access chat for testing
        if (router.pathname !== redirectTo) { // Prevent unnecessary redirects
          router.push(redirectTo);
        }
      } else {
        // Only redirect to login if not already on login or register page
        if (router.pathname !== "/login" && router.pathname !== "/register") {
          router.push("/login");
        }
      }
    }
  }, [isAuthenticated, role, loading, router]);

  const login = (token: string, userRole: string) => {
    // This login function might become redundant if login is handled directly by Supabase methods
    // in the login page. The onAuthStateChange listener will update the context.
    console.log(`AuthContext Instance ${instanceId}: Login function called (might be redundant).`);
    // No direct action needed here as onAuthStateChange will pick up the session.
  };

  const logout = async () => {
    console.log(`AuthContext Instance ${instanceId}: Logout function called.`);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during Supabase logout:", error);
    }
    // Supabase's onAuthStateChange will handle setting isAuthenticated to false
    // and redirecting will be handled by the useEffect in this context or router.push in the component.
    console.log(`AuthContext Instance ${instanceId}: Supabase signOut called.`);
    router.push('/login'); // Redirect to login page after logout
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
