'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserProfile from '@/components/OCID/UserProfile';

export default function DashboardPage() {
  const { authState, isInitialized } = useOCAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && !authState.isAuthenticated) {
      router.push('/');
    }
  }, [isInitialized, authState.isAuthenticated, router]);

  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <UserProfile />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p>You have successfully logged in with OpenCampus ID.</p>
          <p className="mt-4">This is a protected route that requires authentication.</p>
        </div>
      </div>
    </div>
  );
}