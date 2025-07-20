"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until authentication state is loaded

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (role !== 'admin') {
      router.push('/chat');
    }
  }, [isAuthenticated, role, loading, router]);

  if (loading || role !== 'admin') {
    return null; // Render nothing while loading or if not an admin (before redirect)
  }

  return <>{children}</>;
}
