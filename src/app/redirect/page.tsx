'use client'

import { LoginCallBack, useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';

function CustomErrorComponent() {
  const { authState } = useOCAuth();
  return <div className="p-4">Error Logging in: {authState.error?.message}</div>;
}

function CustomLoadingComponent() {
  return <div className="p-4">Loading OpenCampus authentication...</div>;
}

export default function RedirectPage() {
  const router = useRouter();

  const loginSuccess = () => {
    router.push('/dashboard'); // Redirect after successful login
  };

  const loginError = (error: Error) => {
    console.error('Login error:', error);
    // You could also redirect to an error page
    // router.push('/auth-error');
  };

  return (
    <LoginCallBack 
      errorCallback={loginError} 
      successCallback={loginSuccess}
      customErrorComponent={CustomErrorComponent}
      customLoadingComponent={CustomLoadingComponent} 
    />
  );
}