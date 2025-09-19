"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import React from "react";

const teachers = [
  {
    name: "Nodira Karimova",
    email: "nodira.karimova@email.com",
    phone: "+998 90 123 45 67",
    date: "2023-09-15",
  },
  {
    name: "Jamshid Xudoyberdiyev",
    email: "jamshid.xudoyberdiyev@email.com",
    phone: "+998 91 234 56 78",
    date: "2023-10-20",
  },
  {
    name: "Gulnora Rashidova",
    email: "gulnora.rashidova@email.com",
    phone: "+998 93 345 67 89",
    date: "2023-11-25",
  },
  {
    name: "Akmal Mirzayev",
    email: "akmal.mirzayev@email.com",
    phone: "+998 94 456 78 90",
    date: "2024-01-10",
  },
  {
    name: "Dilshod Qodirov",
    email: "dilshod.qodirov@email.com",
    phone: "+998 97 567 89 01",
    date: "2024-02-15",
  },
];

function Instructors() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold">O`qituvchilar</h1>
          <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
            <UserPlus className="w-4 h-4" /> O`qituvchi qo`shish
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Ism yoki email bo`yicha qidirish"
            className="pl-9 w-full"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left table-auto min-w-[700px] max-w-full">
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th className="p-3">Ism</th>
                <th className="p-3">Email</th>
                <th className="p-3">Telefon</th>
                <th className="p-3">Qo`shilgan sana</th>
                <th className="p-3">Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3 truncate">{t.name}</td>
                  <td className="p-3 break-words">{t.email}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">
                    <div className="flex gap-2 text-sm">
                      <button className="text-blue-600 hover:underline">
                        Tahrirlash
                      </button>
                      <span className="text-gray-400">/</span>
                      <button className="text-red-600 hover:underline">
                        O`chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile + Tablet cards */}
        <div className="grid gap-4 md:hidden sm:grid-cols-2">
          {teachers.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{t.name}</p>
                <span className="text-xs text-gray-500">{t.date}</span>
              </div>
              <p className="text-sm text-gray-600 break-words">{t.email}</p>
              <p className="text-sm">{t.phone}</p>
              <div className="flex gap-4 text-sm mt-2">
                <button className="text-blue-600 hover:underline">
                  Tahrirlash
                </button>
                <button className="text-red-600 hover:underline">
                  O`chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Instructors;
