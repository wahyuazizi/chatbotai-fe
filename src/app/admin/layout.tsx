"use client";

import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useAuth();

  if (loading || role !== 'admin') {
    // Render nothing or a loading spinner while auth is being checked
    // or if the user is not an admin.
    return null;
  }

  // Render children only if the user is a confirmed admin.
  return <>{children}</>;
}
