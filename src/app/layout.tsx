import { Toaster } from 'react-hot-toast';
import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'NeMe',
  description: 'Next Messenger',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="antialiased scroll-smooth">
      <body className={''}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
