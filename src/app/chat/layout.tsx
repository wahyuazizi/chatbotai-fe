"use client";

import { useAuth } from '@/context/AuthContext';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading || !isAuthenticated) {
    // Render nothing or a loading spinner while auth is being checked
    // or if the user is not authenticated.
    return null;
  }

  // Render children only if the user is confirmed to be authenticated.
  return <>{children}</>;
}
