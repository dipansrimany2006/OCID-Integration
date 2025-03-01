'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';
import LoginButton from '@/components/OCID/LoginButton';
import UserProfile from '@/components/OCID/UserProfile';

export default function Home() {
  const { authState, isInitialized } = useOCAuth();

  // Show loading state while the auth state is initializing
  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to OpenCampus Demo</h1>
        
        {authState.isAuthenticated ? (
          <UserProfile />
        ) : (
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4 text-center">
              Please log in with your OpenCampus account to continue
            </p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}