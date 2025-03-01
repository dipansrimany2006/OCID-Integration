'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { authState, ocAuth, OCId, ethAddress } = useOCAuth();
  const router = useRouter();

  if (!authState.isInitialized) {
    return <div className="p-4">Initializing...</div>;
  }

  if (authState.error) {
    return <div className="p-4 text-red-500">Error: {authState.error.message}</div>;
  }

  if (!authState.isAuthenticated) {
    return <div className="p-4">Not authenticated</div>;
  }

  const handleLogout = async () => {
    try {
      await ocAuth.logout('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-1">OC ID</h3>
        <p className="bg-white p-2 rounded">{OCId || 'Not available'}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-1">ETH Address</h3>
        <p className="bg-white p-2 rounded break-all">{ethAddress || 'Not available'}</p>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}