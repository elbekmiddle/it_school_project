import { BookOpen, GraduationCap, House, Settings, Users, PanelRightOpen, PanelRightClose, ChartNoAxesCombined } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

function Sidebar({ isOpen, setIsOpen }: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // qo‘shimcha navigation logika bo‘lsa, shu yerda ishlaydi
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="fixed cursor-pointer top-4 left-4 z-50 bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition"
      >
        {isOpen ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
      </button> 

      <div
        className={`fixed top-0 left-0 h-screen bg-gray-50 p-4 border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex-1 mt-16">
          <div className="flex flex-col gap-2">
            <Link href="/dashboard" className="cursor-pointer hover:bg-gray-200 p-2 rounded transition">
              <div className={`flex items-center gap-2 text-gray-700 ${!isOpen && 'justify-center'}`}>
                <House size={isOpen ? 20 : 24} />
                {isOpen && <span>Asosiy</span>}
              </div>
            </Link>
            <Link href="/courses" className="cursor-pointer hover:bg-gray-200 p-2 rounded transition">
              <div className={`flex items-center gap-2 text-gray-700 ${!isOpen && 'justify-center'}`}>
                <BookOpen size={isOpen ? 20 : 24} />
                {isOpen && <span>Kurslar</span>}
              </div>
            </Link>
            <Link href="/students" className="cursor-pointer hover:bg-gray-200 p-2 rounded transition">
              <div className={`flex items-center gap-2 text-gray-700 ${!isOpen && 'justify-center'}`}>
                <GraduationCap size={isOpen ? 20 : 24} />
                {isOpen && <span>O‘quvchilar</span>}
              </div>
            </Link>
            <Link href="/instructors" className="cursor-pointer hover:bg-gray-200 p-2 rounded transition">
              <div className={`flex items-center gap-2 text-gray-700 ${!isOpen && 'justify-center'}`}>
                <Users size={isOpen ? 20 : 24} />
                {isOpen && <span>O`qituvchilar</span>}
              </div>
            </Link>
            <Link href="/settings" className="cursor-pointer hover:bg-gray-200 p-2 rounded transition">
              <div className={`flex items-center gap-2 text-gray-700 ${!isOpen && 'justify-center'}`}>
                <ChartNoAxesCombined size={isOpen ? 20 : 24} />
                {isOpen && <span>Xisobot</span>}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
