'use client'

import { ReactNode } from 'react';
import { OCConnect, OCConnectProps } from '@opencampus/ocid-connect-js';

interface OCConnectWrapperProps {
  children: ReactNode;
  opts: {
    redirectUri: string;
    referralCode: string;
    domain?: string;
    sameSite?: boolean;
  };
  sandboxMode?: boolean;
}

export default function OCConnectWrapper({ 
  children, 
  opts, 
  sandboxMode = true 
}: OCConnectWrapperProps) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children}
    </OCConnect>
  );
}