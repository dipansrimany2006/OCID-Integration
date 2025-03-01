# OCID SDK Integration Guide

This guide will help you integrate the OpenCampus ID (OCID) Connect JavaScript SDK into your Next.js application.

## Overview

The OCID SDK (`@opencampus/ocid-connect-js`) provides authentication and identity management capabilities for applications that need to connect to OpenCampus services.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Next.js project (version 13.0.0 or higher)

## Installation

The OCID SDK is already included as a dependency in your project. If you need to install it in a new project, run:

```bash
npm install @opencampus/ocid-connect-js
# or
yarn add @opencampus/ocid-connect-js
```

## Basic Setup

### 1. Initialize the OCID Client

Create a new file (e.g., `lib/ocid.js`) to initialize the OCID client:

```javascript
import { OcidClient } from '@opencampus/ocid-connect-js';

const ocidClient = new OcidClient({
  clientId: process.env.OCID_CLIENT_ID,
  redirectUri: process.env.OCID_REDIRECT_URI,
  ocidBaseUrl: process.env.OCID_BASE_URL,
  scope: 'openid profile email', // Adjust scopes as needed
});

export default ocidClient;
```

### 2. Set Environment Variables

Create or update your `.env.local` file with the required OCID configuration:

```
OCID_CLIENT_ID=your_client_id
OCID_REDIRECT_URI=http://localhost:3000/auth/callback
OCID_BASE_URL=https://identity.opencampus.io
```

Remember to add these variables to your production environment as well.

### 3. Create Authentication Components

#### Login Button Component

```jsx
// components/LoginButton.jsx
import React from 'react';
import ocidClient from '../lib/ocid';

export default function LoginButton() {
  const handleLogin = () => {
    ocidClient.login();
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Sign in with OCID
    </button>
  );
}
```

#### Auth Callback Page

Create a callback page to handle the authentication response:

```jsx
// pages/auth/callback.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ocidClient from '../../lib/ocid';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Process the authentication response
        await ocidClient.handleRedirectCallback();
        
        // Get the user profile
        const user = await ocidClient.getUser();
        
        // Store user information or token as needed
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to the application home or dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/auth/error');
      }
    }

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router]);

  return <div>Processing authentication...</div>;
}
```

### 4. Create Authentication Provider

For application-wide authentication state, create an auth context provider:

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import ocidClient from '../lib/ocid';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        if (ocidClient.isAuthenticated()) {
          const userData = await ocidClient.getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  const login = () => ocidClient.login();
  
  const logout = () => {
    ocidClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 5. Wrap Your Application

Update your `_app.js` or `_app.tsx` file:

```jsx
// pages/_app.jsx
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
```

## Protected Routes

Create a higher-order component to protect routes that require authentication:

```jsx
// components/ProtectedRoute.jsx
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
}
```

Use it to wrap protected pages:

```jsx
// pages/dashboard.jsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>This is a protected page</p>
      </div>
    </ProtectedRoute>
  );
}
```

## API Authentication

To make authenticated API requests, include the OCID token in your requests:

```javascript
// Making authenticated API requests
import ocidClient from '../lib/ocid';

async function fetchProtectedData() {
  try {
    const token = await ocidClient.getToken();
    
    const response = await fetch('https://api.example.com/protected-data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

## Advanced Configuration

### Token Refresh

The OCID SDK handles token refresh automatically. You can customize this behavior:

```javascript
import { OcidClient } from '@opencampus/ocid-connect-js';

const ocidClient = new OcidClient({
  clientId: process.env.OCID_CLIENT_ID,
  redirectUri: process.env.OCID_REDIRECT_URI,
  ocidBaseUrl: process.env.OCID_BASE_URL,
  scope: 'openid profile email',
  // Refresh token 5 minutes before expiration
  tokenRefreshThreshold: 5 * 60,
});
```

### Custom Storage

By default, tokens are stored in localStorage. You can provide a custom storage implementation:

```javascript
const customStorage = {
  getItem: (key) => {
    // Custom get implementation
  },
  setItem: (key, value) => {
    // Custom set implementation
  },
  removeItem: (key) => {
    // Custom remove implementation
  }
};

const ocidClient = new OcidClient({
  // ... other options
  storage: customStorage,
});
```

## Troubleshooting

### Common Issues

1. **"Invalid client_id" error**:
   - Verify your OCID_CLIENT_ID is correct and properly registered

2. **"Invalid redirect_uri" error**:
   - Ensure the redirect URI exactly matches what's registered for your client

3. **Token validation failures**:
   - Check that your system clock is synchronized
   - Verify the OCID_BASE_URL is correct

### Debugging

Enable debug mode to get detailed logs:

```javascript
const ocidClient = new OcidClient({
  // ... other options
  debug: true,
});
```

## Resources

- [OCID SDK Documentation](https://docs.opencampus.io/ocid-connect-js/)
- [OpenCampus Developer Portal](https://developers.opencampus.io)
- [OIDC Specification](https://openid.net/specs/openid-connect-core-1_0.html)

## License

This project is licensed under the terms specified in the package.json file.