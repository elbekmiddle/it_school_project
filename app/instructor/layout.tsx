"use client";

import { ReactNode } from "react";
import InstructorLayout from "@/components/InstructorLayout";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function InstructorRootLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <InstructorLayout>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </InstructorLayout>
    </SessionProvider>
  );
}
