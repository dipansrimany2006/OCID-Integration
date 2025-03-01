'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useState } from 'react';

interface LoginButtonProps {
  className?: string;
  buttonText?: string;
  stateParam?: string;
}

export default function LoginButton({ 
  className = '', 
  buttonText = 'Login with OpenCampus', 
  stateParam = 'opencampus' 
}: LoginButtonProps) {
  const { ocAuth } = useOCAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await ocAuth.signInWithRedirect({ state: stateParam });
    } catch (error) {
      console.error('Login initialization error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogin} 
      disabled={isLoading}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {isLoading ? 'Connecting...' : buttonText}
    </button>
  );
}