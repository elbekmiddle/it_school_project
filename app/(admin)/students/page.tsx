"use client"

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const studentsData = [
  { id: 1, name: "Liam Harper", email: "liam.harper@example.com", course: "Data Science Fundamentals", paymentStatus: "Paid", lastPaymentDate: "2024-03-15" },
  { id: 2, name: "Olivia Bennett", email: "olivia.bennett@example.com", course: "Web Development Bootcamp", paymentStatus: "Pending", lastPaymentDate: "2024-02-28" },
  { id: 3, name: "Noah Carter", email: "noah.carter@example.com", course: "Mobile App Development", paymentStatus: "Paid", lastPaymentDate: "2024-03-05" },
  { id: 4, name: "Ava Mitchell", email: "ava.mitchell@example.com", course: "Cybersecurity Essentials", paymentStatus: "Paid", lastPaymentDate: "2024-03-10" },
  { id: 5, name: "Ethan Parker", email: "ethan.parker@example.com", course: "Cloud Computing Basics", paymentStatus: "Pending", lastPaymentDate: "2024-02-20" },
  { id: 6, name: "Isabella Reed", email: "isabella.reed@example.com", course: "AI and Machine Learning", paymentStatus: "Paid", lastPaymentDate: "2024-03-01" },
  { id: 7, name: "Jackson Foster", email: "jackson.foster@example.com", course: "Digital Marketing Strategy", paymentStatus: "Paid", lastPaymentDate: "2024-03-12" },
];

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all"); // Default to "all"
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all"); // Default to "all"

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || student.course === selectedCourse;
    const matchesPaymentStatus = selectedPaymentStatus === "all" || student.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesCourse && matchesPaymentStatus;
  });

  const courses = [...new Set(studentsData.map((student) => student.course))];
  const paymentStatuses = ["Paid", "Pending"];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Students</h1>
      <p className="text-gray-500 mb-6">Manage all student records, including enrollment details, payment status, and contact information.</p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <Input
            type="text"
            placeholder="Search students by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course} value={course}>{course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {paymentStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of all students.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="w-[150px]">Payment Status</TableHead>
              <TableHead className="w-[150px]">Last Payment Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      student.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {student.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>{student.lastPaymentDate}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/students/${student.id}/edit`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Students;