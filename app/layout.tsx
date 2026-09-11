import type { Metadata, Viewport } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AppHeader from '@/components/AppHeader';

export const metadata: Metadata = {
  title: {
    default: 'SFP — Line Dashboard',
    template: '%s | SFP',
  },
  description: 'SFP Operator Dashboard — real-time line monitoring for shift floor planning.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Icons+Outlined&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-shell">
          <AppHeader />
          <div className="app-body">
            {/* Sidebar hidden for now */}
            {/* <Sidebar /> */}
            <main className="app-main">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
