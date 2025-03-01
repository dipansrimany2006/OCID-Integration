'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { authState, isInitialized } = useOCAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !authState.isAuthenticated) {
      router.push('/');
    }
  }, [isInitialized, authState.isAuthenticated, router]);

  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}