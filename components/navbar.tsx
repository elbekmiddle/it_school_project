"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, User, Menu } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotif = () => setNotifOpen(!notifOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div>
          
        </div>
        {/* Left: Logo */}
        <Link href="/" className="font-bold text-lg md:text-xl">
          IT School
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Menu
            className="cursor-pointer md:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Desktop / Tablet */}
        <div className={`flex items-center gap-6 ${isMobile ? "hidden" : ""}`}>
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Bell className="cursor-pointer" onClick={toggleNotif} />
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md z-20">
                <p className="p-2 text-sm border-b border-gray-100">Yangi bildirishnoma 1</p>
                <p className="p-2 text-sm border-b border-gray-100">Yangi bildirishnoma 2</p>
                <p className="p-2 text-sm">Yangi bildirishnoma 3</p>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <div
              className="flex items-center cursor-pointer gap-2"
              onClick={toggleUserMenu}
            >
              <User />
              {session?.user?.name && <span className="hidden md:inline">{session.user.name}</span>}
            </div>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-20">
                <Link
                  href="/profile"
                  className="block p-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left p-2 text-sm hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && isMobile && (
        <div className="px-4 pb-4 md:hidden flex flex-col gap-2 bg-white border-t border-gray-200">
          <div className="relative" ref={notifRef}>
            <Bell className="cursor-pointer" onClick={toggleNotif} />
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md z-20">
                <p className="p-2 text-sm border-b border-gray-100">Yangi bildirishnoma 1</p>
                <p className="p-2 text-sm border-b border-gray-100">Yangi bildirishnoma 2</p>
                <p className="p-2 text-sm">Yangi bildirishnoma 3</p>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <div
              className="flex items-center cursor-pointer gap-2"
              onClick={toggleUserMenu}
            >
              <User />
              {session?.user?.name && <span>{session.user.name}</span>}
            </div>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-20">
                <Link
                  href="/profile"
                  className="block p-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left p-2 text-sm hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
