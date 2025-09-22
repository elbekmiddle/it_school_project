"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const data = {
    labels: [
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyn",
      "Iyl",
      "Avg",
      "Sen",
      "Okt",
      "Noy",
      "Dek",
    ],
    datasets: [
      {
        label: "This year",
        data: [35, 55, 82, 60, 80, 45, 95, 70, 62, 73, 85, 90],
        backgroundColor: "rgba(59, 130, 246, 0.4)",
      },
      {
        label: "Last year",
        data: [50, 65, 75, 58, 88, 40, 100, 80, 70, 77, 90, 95],
        backgroundColor: "rgba(37, 99, 235, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 📌 grafik ekran o‘lchamiga moslashadi
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-semibold">Hisobotlar</h1>
        <Button className="w-full md:w-auto cursor-pointer">Export to Excel</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sana oralig‘i" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Hafta</SelectItem>
            <SelectItem value="month">Oy</SelectItem>
            <SelectItem value="year">Yil</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="O‘qituvchi bo‘yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smith">Dr. Smith</SelectItem>
            <SelectItem value="davis">Dr. Davis</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Kurs bo‘yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow h-[300px] md:h-[400px]">
        <h2 className="text-base md:text-lg font-medium mb-4">Oylik tushum</h2>
        <Bar data={data} options={options} />
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="p-2">Date</th>
              <th className="p-2">Student Name</th>
              <th className="p-2">Course</th>
              <th className="p-2">Instructor</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b text-sm">
              <td className="p-2">2024-07-26</td>
              <td className="p-2">Alice Johnson</td>
              <td className="p-2">Mathematics</td>
              <td className="p-2">Dr. Robert Smith</td>
              <td className="p-2 font-medium">$150.00</td>
              <td className="p-2">Credit Card</td>
            </tr>
            <tr className="text-sm">
              <td className="p-2">2024-07-25</td>
              <td className="p-2">Bob Williams</td>
              <td className="p-2">Physics</td>
              <td className="p-2">Dr. Emily Davis</td>
              <td className="p-2 font-medium">$200.00</td>
              <td className="p-2">Cash</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
