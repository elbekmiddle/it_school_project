"use client";

import Image from "next/image";
import Logo from "@/public/Logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // 🔥 Sonner import

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email yoki parol noto`g`ri!");
      toast.error("Email yoki parol noto`g`ri!"); // 🔥 Sonner xatolik
    } else {
      setError("");
      toast.success("Tizimga muvaffaqiyatli kirildi!"); // 🔥 Sonner muvaffaqiyat
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <div className="mb-6 flex justify-center">
          <Image src={Logo} width={200} height={120} alt="IT School Logo" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Parol"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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
