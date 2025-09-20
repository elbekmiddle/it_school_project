"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import InstrucotrSidebar from "@/components/InstructorSidebar";
import { useState } from "react";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login";

  // Sidebar state bu yerda turadi
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {!hideLayout && (
        <>
          <Navbar />
          <InstrucotrSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
      )}

      <main
        className={`transition-all duration-300 pt-16 
          ${!hideLayout ? (isOpen ? "pl-[260px]" : "pl-[68px]") : ""} 
          pr-4 pb-4`}
      >
        {children}
      </main>
    </>
  );
}
