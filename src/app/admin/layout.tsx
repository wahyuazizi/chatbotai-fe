"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <Image
                src="/logo_fakultas.png"
                alt="Logo Fakultas"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">Fakultas Teknik Universitas Hamzanwadi</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
