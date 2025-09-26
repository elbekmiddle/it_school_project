import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Course from '@/models/Course';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  return requireAuth(request, ['admin', 'instructor'], async (user) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(request.url);
      const timeframe = searchParams.get('timeframe') || 'month'; // week, month, year
      const instructorId = searchParams.get('instructorId');

      const filter: Record<string, unknown> = {};
      
      if (user.role === 'instructor') {
        filter.instructorId = user.id;
      } else if (user.role === 'admin' && instructorId && instructorId !== 'all') {
        filter.instructorId = instructorId;
      }

      // Sana oralig'ini hisoblash
      const dateFilter = getDateFilter(timeframe);
      if (dateFilter) {
        filter.createdAt = dateFilter;
      }

      // Asosiy statistikalar
      const [
        totalCourses,
        totalInstructors,
        totalStudents,
        activeStudents,
        paidStudents,
        monthlyRevenue,
        recentActivities
      ] = await Promise.all([
        Course.countDocuments({ status: 'active' }),
        User.countDocuments({ role: 'instructor' }),
        Student.countDocuments(filter),
        Student.countDocuments({ ...filter, paymentStatus: 'paid' }),
        Student.countDocuments({ ...filter, paymentStatus: 'paid', ...(dateFilter && { lastPaymentDate: dateFilter }) }),
        calculateMonthlyRevenue(filter),
        getRecentActivities(filter)
      ]);

      // Oylik statistikalar
      const monthlyStats = await getMonthlyStats(filter);

      return NextResponse.json({
        stats: {
          totalCourses,
          totalInstructors,
          totalStudents,
          activeStudents,
          monthlyRevenue,
          newStudents: totalStudents, // Vaqt oralig'iga qarab
          completionRate: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0
        },
        monthlyStats,
        recentActivities,
        timeframe
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}

function getDateFilter(timeframe: string) {
  const now = new Date();
  const startDate = new Date();

  switch (timeframe) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  return {
    $gte: startDate,
    $lte: now
  };
}

async function calculateMonthlyRevenue(filter: Record<string, unknown>) {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const monthlyFilter = {
    ...filter,
    paymentStatus: 'paid',
    lastPaymentDate: {
      $gte: currentMonth,
      $lt: nextMonth
    }
  };

  const paidStudents = await Student.find(monthlyFilter);
  return paidStudents.reduce((sum, student) => sum + (student.paymentAmount || 0), 0);
}

async function getMonthlyStats(filter: Record<string, unknown>) {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

    const monthFilter = {
      ...filter,
      createdAt: {
        $gte: monthDate,
        $lt: nextMonth
      }
    };

    const paymentFilter = {
      ...filter,
      paymentStatus: 'paid',
      lastPaymentDate: {
        $gte: monthDate,
        $lt: nextMonth
      }
    };

    const [students, paidStudents] = await Promise.all([
      Student.countDocuments(monthFilter),
      Student.find(paymentFilter)
    ]);

    const revenue = paidStudents.reduce((sum, student) => sum + (student.paymentAmount || 0), 0);

    months.push({
      month: monthDate.toLocaleDateString('uz-UZ', { month: 'short' }),
      revenue,
      students
    });
  }

  return months;
}

async function getRecentActivities(filter: Record<string, unknown>) {
  const students = await Student.find(filter)
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

  return students.map(student => ({
    id: student._id.toString(),
    name: student.name,
    role: 'student',
    course: student.course?.title || 'Nomaʼlum',
    date: student.createdAt,
    type: 'qo`shildi',
    amount: student.paymentAmount || null
  }));
}