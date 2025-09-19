"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import React, { useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login";

  // Sidebar state
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {!hideLayout && (
        <>
          <Navbar />
          {/* Sidebar ga isOpen va setIsOpen beramiz */}
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
      )}

      {/* Content qismi sidebar state ga qarab joylashadi */}
      <main
        className={`transition-all duration-300 pt-16 ${
          hideLayout ? "" : isOpen ? "pl-64" : "pl-16"
        }`}
      >
        {children}
      </main>
    </>
  );
}
