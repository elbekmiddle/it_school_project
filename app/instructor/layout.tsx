import InstructorLayout from '@/components/InstructorLayout';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100"> {/* Static classes */}
        <InstructorLayout>{children}</InstructorLayout>
      </body>
    </html>
  );
}