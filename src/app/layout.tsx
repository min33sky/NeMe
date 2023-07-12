import './globals.css';
import type { Metadata } from 'next';

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
      <body className={''}>{children}</body>
    </html>
  );
}
