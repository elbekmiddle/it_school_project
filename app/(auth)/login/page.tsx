"use client";

import Image from "next/image";
import Logo from "@/public/Logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image src={Logo} width={200} height={120} alt="IT School Logo" />
        </div>

        {/* Title */}
        {/* <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">IT School</h1>
          <p className="text-sm text-gray-500">Iltimos, tizimga kiring</p>
        </div> */}

        {/* Form */}
        <form className="space-y-4">
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Parol" required />

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Parolni unutdingizmi?
            </a>
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            Kirish
          </Button>
        </form>
      </div>
    </div>
  );
}
