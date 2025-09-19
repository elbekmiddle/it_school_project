"use client";

import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const courses = [
  {
    name: "Introduction to Programming",
    duration: "12 hafta",
    price: "$500",
    status: "Faol",
  },
  {
    name: "Web Development Fundamentals",
    duration: "10 hafta",
    price: "$450",
    status: "Faol",
  },
  {
    name: "Data Science Basics",
    duration: "14 hafta",
    price: "$600",
    status: "Nofaol",
  },
  {
    name: "Mobile App Development",
    duration: "16 hafta",
    price: "$700",
    status: "Faol",
  },
  {
    name: "Cloud Computing Essentials",
    duration: "12 hafta",
    price: "$550",
    status: "Nofaol",
  },
];

function Courses() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Kurslar</h1>
        <Button className="flex items-center gap-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full md:w-auto justify-center">
          <Plus className="w-4 h-4" />
          Kurs qo`shish
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableCaption className="text-left mb-4 font-semibold">
            Barcha kurslar ro`yxati
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Kurs nomi</TableHead>
              <TableHead>Davomiyligi</TableHead>
              <TableHead>Narxi</TableHead>
              <TableHead>Holati</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      course.status === "Faol"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {course.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="p-2 cursor-pointer rounded-md hover:bg-gray-50"
                      title="Tahrirlash"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      className="p-2 cursor-pointer rounded-md hover:bg-gray-50"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Courses;
