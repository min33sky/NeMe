import { Toaster } from 'react-hot-toast';
import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import AlertModal from '@/components/AlertModal';

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
    <html
      lang="ko"
      className="antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <body className={''}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <AlertModal />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
