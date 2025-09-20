import ClientLayout from '@/components/ClientLayout';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100"> {/* Static classes */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}