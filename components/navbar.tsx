import React from 'react';
import { Bell, User } from 'lucide-react';
import Link from 'next/link';

function Navbar() {
  return (
    <div className='fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10' style={{ maxWidth: '100%', marginLeft: '0', marginRight: '2rem' }}>
      <div>
        <Link href={'/'} className='cursor-pointer flex items-center'>
          <span className='w-6 h-6 bg-gray-200 rounded flex items-center justify-center mr-2'>
            <span className='text-gray-600' style={{ fontSize: '12px' }}>≫</span>
          </span>
          <p className='font-bold' style={{ marginLeft: '20%' }}>It School</p>
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
            margin-right: 0;
          }
          .navbar div {
            width: 100%;
            text-align: center;
            margin-bottom: 0.5rem;
          }
          .navbar .flex {
            gap: 4;
            justify-content: center;
          }
          .navbar .flex items-center span {
            display: none;
          }
          .navbar .flex items-center p {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}

export default Navbar;