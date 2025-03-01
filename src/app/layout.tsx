import { ReactNode } from 'react';
import OCConnectWrapper from '@/components/OCID/OCConnectWrapper';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  const opts = {
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/redirect',
    referralCode: process.env.NEXT_PUBLIC_REFERRAL_CODE || 'PARTNER6',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <OCConnectWrapper opts={opts} sandboxMode={true}>
          {children}
        </OCConnectWrapper>
      </body>
    </html>
  );
}