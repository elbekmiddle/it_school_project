'use client';

import { Button } from "@/components/ui/button";
import { Download, Users, BookOpen, GraduationCap, DollarSign, Calendar, TrendingUp, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Instructor {
  _id: string;
  name: string;
}

interface DashboardData {
  stats: {
    totalCourses: number;
    totalInstructors: number;
    totalStudents: number;
    activeStudents: number;
    monthlyRevenue: number;
    newStudents: number;
    completionRate: number;
  };
  monthlyStats: Array<{
    month: string;
    revenue: number;
    students: number;
  }>;
  recentActivities: Array<{
    id: string;
    name: string;
    role: string;
    course: string;
    date: string;
    type: string;
    amount: number | null;
  }>;
  timeframe: string;
}

function Page() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchInstructors();
  }, [selectedInstructor, timeframe]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ timeframe });
      if (selectedInstructor !== 'all') {
        params.append('instructorId', selectedInstructor);
      }

      const response = await fetch(`/api/dashboard?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleExport = () => {
    // Dashboard ma'lumotlarini export qilish
    alert('Dashboard ma\'lumotlari eksport qilindi!');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center text-red-600">Ma`lumotlarni yuklashda xatolik</div>
      </div>
    );
  }

  const { stats, monthlyStats, recentActivities } = dashboardData;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {timeframe === 'week' ? 'Haftalik' : timeframe === 'month' ? 'Oylik' : 'Yillik'} ko`rsatkichlar
          </p>
        </div>
        <Button 
          onClick={handleExport} 
          className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 w-full md:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          Hisobot yuklab olish
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger>
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Vaqt oralig'i" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Haftalik</SelectItem>
            <SelectItem value="month">Oylik</SelectItem>
            <SelectItem value="year">Yillik</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
          <SelectTrigger>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="O'qituvchi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha o`qituvchilar</SelectItem>
            {instructors.map(instructor => (
              <SelectItem key={instructor._id} value={instructor._id}>
                {instructor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center bg-white rounded-lg border p-3">
          <span className="text-sm text-gray-600">
            {selectedInstructor === 'all' ? 'Barcha ma\'lumotlar' : 'Filtirlangan'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold text-sm">Umumiy kurslar</p>
              <p className="text-2xl font-bold mt-2">{stats.totalCourses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold text-sm">O`qituvchilar</p>
              <p className="text-2xl font-bold mt-2">{stats.totalInstructors}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold text-sm">O`quvchilar</p>
              <p className="text-2xl font-bold mt-2">{stats.totalStudents}</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +{stats.newStudents} yangi
              </p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold text-sm">Oylik daromad</p>
              <p className="text-2xl font-bold mt-2 text-green-600">
                {stats.monthlyRevenue.toLocaleString()} so`m
              </p>
              <p className="text-sm text-gray-600 mt-1">{stats.activeStudents} aktiv</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Oylik daromad</h3>
          <div className="space-y-2">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stat.month}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{stat.revenue.toLocaleString()} so`m</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(stat.revenue / Math.max(...monthlyStats.map(s => s.revenue))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Yangi o`quvchilar</h3>
          <div className="space-y-2">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stat.month}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{stat.students} ta</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(stat.students / Math.max(...monthlyStats.map(s => s.students))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <Table>
          <TableCaption className="text-left mb-4 font-semibold text-lg">
            So`nggi faoliyatlar
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ism</TableHead>
              <TableHead>Turi</TableHead>
              <TableHead>Kurs</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead className="text-right">Summa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.role === 'student' ? 'bg-blue-100 text-blue-800' :
                    activity.role === 'instructor' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {activity.role === 'student' ? 'O`quvchi' : 
                     activity.role === 'instructor' ? 'O`qituvchi' : 'Kurs'}
                  </span>
                </TableCell>
                <TableCell>{activity.course}</TableCell>
                <TableCell>{new Date(activity.date).toLocaleDateString('uz-UZ')}</TableCell>
                <TableCell className="text-right font-medium">
                  {activity.amount ? `${activity.amount.toLocaleString()} so'm` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Page;