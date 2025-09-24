"use client";

import { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ClientLayout>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </ClientLayout>
    </SessionProvider>
  );
}
