import React from 'react';
import { Bell, User } from 'lucide-react';
import Link from 'next/link';

function Navbar() {
  return (
    <div className='fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10'>
      <div>
        
      </div>
      <div className="flex items-center">
        <Link href={'/'} className='cursor-pointer flex items-center'>
          <p className='font-bold'>It School</p>
        </Link>
      </div>
      <div className="flex gap-8 items-center">
        <Bell className='cursor-pointer' />
        <User className='cursor-pointer' />
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .navbar {
            flex-direction: column;
            height: auto;
            padding: 1rem;
          }
          .navbar div:first-child {
            width: 100%;
            text-align: center;
            margin-bottom: 0.5rem;
          }
          .navbar .flex {
            gap: 4;
            justify-content: center;
          }
          .navbar .flex.items-center button {
            display: none; /* Hide toggle on mobile if not needed */
          }
          .navbar .flex.items-center p {
            margin: 0 auto;
          }
        }
        @media (min-width: 641px) and (max-width: 768px) { /* sm breakpoint */
          .navbar .flex.items-center {
            justify-content: center;
          }
          .navbar .flex.items-center p {
            margin-left: 0;
          }
        }
        @media (min-width: 769px) { /* md and up */
          .navbar .flex.items-center {
            justify-content: flex-start;
          }
          .navbar .flex.items-center p {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Navbar;