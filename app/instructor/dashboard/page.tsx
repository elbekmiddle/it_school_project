"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Chart.js registratsiya
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const data = [
  {
    name: "Emily Carter",
    role: "Teacher",
    course: "Introduction to Programming",
    date: "2024-07-26",
  },
  {
    name: "David Lee",
    role: "Teacher",
    course: "Data Science Fundamentals",
    date: "2024-07-25",
  },
  {
    name: "Sarah Jones",
    role: "Teacher",
    course: "Web Development Basics",
    date: "2024-07-24",
  },
  {
    name: "Programming Fundamentals",
    role: "Course",
    course: "Emily Carter",
    date: "2024-07-26",
  },
  {
    name: "Advanced Data Analysis",
    role: "Course",
    course: "David Lee",
    date: "2024-07-25",
  },
];

// Grafik uchun data
const studentData = {
  labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul"],
  datasets: [
    {
      label: "O'quvchilar soni",
      data: [50, 75, 100, 120, 150, 180, 200],
      backgroundColor: "rgba(37, 99, 235, 0.6)", // blue-600
    },
  ],
};

const revenueData = {
  labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul"],
  datasets: [
    {
      label: "Oylik daromad ($)",
      data: [2000, 3000, 5000, 7000, 8000, 12000, 15000],
      borderColor: "rgba(22, 163, 74, 0.8)", // green-600
      backgroundColor: "rgba(22, 163, 74, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

function Page() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button className="flex items-center gap-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full md:w-auto justify-center">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 font-semibold text-sm md:text-base">
            Umumiy kurslar soni
          </p>
          <p className="text-xl md:text-2xl font-bold mt-2">120</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 font-semibold text-sm md:text-base">
            Umumiy o`qituvchilar soni
          </p>
          <p className="text-xl md:text-2xl font-bold mt-2">35</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 font-semibold text-sm md:text-base">
            Umumiy o`quvchilar soni
          </p>
          <p className="text-xl md:text-2xl font-bold mt-2">500</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 font-semibold text-sm md:text-base">
            Oylik tushum
          </p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-green-600">
            $15,000
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">O`quvchilar statistikasi</h2>
          <Bar data={studentData} />
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Daromad statistikasi</h2>
          <Line data={revenueData} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableCaption className="text-left mb-4 font-semibold">
            So`nggi qo`shilgan o`qituvchilar va kurslar
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nomi</TableHead>
              <TableHead>Roli</TableHead>
              <TableHead>Kurs</TableHead>
              <TableHead>Qo`shilgan sana</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.course}</TableCell>
                <TableCell>{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Page;
