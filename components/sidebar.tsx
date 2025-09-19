import {
  BookOpen,
  GraduationCap,
  House,
  Settings,
  Users,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import Link from "next/link";
import React from "react";

function sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition"
      >
        {isOpen ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-gray-100 border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Sidebar content */}
        <div className="flex-1 mt-16">
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 text-gray-700 transition"
            >
              <House size={isOpen ? 20 : 28} />
              {isOpen && <span>Asosiy</span>}
            </Link>

            <Link
              href="/courses"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 text-gray-700 transition"
            >
              <BookOpen size={isOpen ? 20 : 28} />
              {isOpen && <span>Kurslar</span>}
            </Link>

            <Link
              href="/students"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 text-gray-700 transition"
            >
              <GraduationCap size={isOpen ? 20 : 28} />
              {isOpen && <span>O‘quvchilar</span>}
            </Link>

            <Link
              href="/teachers"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 text-gray-700 transition"
            >
              <Users size={isOpen ? 20 : 28} />
              {isOpen && <span>O‘qituvchilar</span>}
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 text-gray-700 transition"
            >
              <Settings size={isOpen ? 20 : 28} />
              {isOpen && <span>Sozlamalar</span>}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default sidebar;
