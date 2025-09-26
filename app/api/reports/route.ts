import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Course from '@/models/Course';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { ReportResponse, ReportType } from '@/types/report';

export async function GET(request: NextRequest) {
  return requireAuth(request, ['admin', 'instructor'], async (user) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(request.url);
      const reportType = searchParams.get('type') as ReportType;
      const instructorId = searchParams.get('instructorId');
      
      if (!reportType || !['students', 'payments', 'courses'].includes(reportType)) {
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
      }

      let reportData: ReportResponse;

      switch (reportType) {
        case 'students':
          reportData = await getStudentsReport(instructorId, user.role, user.id);
          break;
        case 'payments':
          reportData = await getPaymentsReport(instructorId, user.role, user.id);
          break;
        case 'courses':
          reportData = await getCoursesReport(instructorId, user.role, user.id);
          break;
        default:
          return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
      }

      return NextResponse.json(reportData);
    } catch (error) {
      console.error('Report error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}

async function getStudentsReport(
  instructorId: string | null, 
  userRole: string, 
  userId: string
): Promise<ReportResponse> {
  const filter: Record<string, unknown> = {};
  
  // Agar instructor bo'lsa, faqat o'zining o'quvchilarini ko'rsin
  if (userRole === 'instructor') {
    filter.instructorId = userId;
  } 
  // Agar admin bo'lsa va instructorId tanlangan bo'lsa
  else if (userRole === 'admin' && instructorId && instructorId !== 'all') {
    filter.instructorId = instructorId;
  }

  const students = await Student.find(filter)
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(100);

  const studentReports = students.map(student => ({
    name: student.name,
    phone: student.phone,
    course: student.course?.title || 'Nomaʼlum',
    startDate: student.startDate,
    paymentStatus: student.paymentStatus,
    lastPaymentDate: student.lastPaymentDate
  }));

  const totalStudents = await Student.countDocuments(filter);

  return {
    type: 'students',
    total: totalStudents,
    data: studentReports
  };
}

async function getPaymentsReport(
  instructorId: string | null, 
  userRole: string, 
  userId: string
): Promise<ReportResponse> {
  const filter: Record<string, unknown> = { paymentStatus: 'paid' };
  
  // Agar instructor bo'lsa, faqat o'zining to'lovlarini ko'rsin
  if (userRole === 'instructor') {
    filter.instructorId = userId;
  } 
  // Agar admin bo'lsa va instructorId tanlangan bo'lsa
  else if (userRole === 'admin' && instructorId && instructorId !== 'all') {
    filter.instructorId = instructorId;
  }

  const paidStudents = await Student.find(filter)
    .populate('course', 'title')
    .sort({ lastPaymentDate: -1 })
    .limit(100);

  const totalRevenue = paidStudents.reduce((sum, student) => {
    return sum + (student.paymentAmount || 0);
  }, 0);
  
  // Countlar uchun filter
  const countFilter: Record<string, unknown> = {};
  if (userRole === 'instructor') {
    countFilter.instructorId = userId;
  } else if (userRole === 'admin' && instructorId && instructorId !== 'all') {
    countFilter.instructorId = instructorId;
  }

  const unpaidCount = await Student.countDocuments({ ...countFilter, paymentStatus: 'unpaid' });
  const overdueCount = await Student.countDocuments({ ...countFilter, paymentStatus: 'overdue' });
  const paidCount = await Student.countDocuments({ ...countFilter, paymentStatus: 'paid' });

  const paymentReports = paidStudents.map(student => ({
    studentName: student.name,
    course: student.course?.title || 'Nomaʼlum',
    amount: student.paymentAmount || 0,
    paymentDate: student.lastPaymentDate
  }));

  return {
    type: 'payments',
    totalRevenue,
    paidCount,
    unpaidCount,
    overdueCount,
    payments: paymentReports
  };
}

async function getCoursesReport(
  instructorId: string | null, 
  userRole: string, 
  userId: string
): Promise<ReportResponse> {
  const courses = await Course.find({ status: 'active' });
  
  const courseReports = await Promise.all(
    courses.map(async (course) => {
      // Har bir kurs uchun filter
      const studentFilter: Record<string, unknown> = { course: course._id };
      
      if (userRole === 'instructor') {
        studentFilter.instructorId = userId;
      } else if (userRole === 'admin' && instructorId && instructorId !== 'all') {
        studentFilter.instructorId = instructorId;
      }

      const totalStudents = await Student.countDocuments(studentFilter);
      const paidStudents = await Student.countDocuments({ 
        ...studentFilter, 
        paymentStatus: 'paid' 
      });

      const paidStudentsData = await Student.find({ 
        ...studentFilter, 
        paymentStatus: 'paid' 
      });
      
      const revenue = paidStudentsData.reduce((sum, student) => {
        return sum + (student.paymentAmount || 0);
      }, 0);

      return {
        courseName: course.title,
        totalStudents,
        paidStudents,
        revenue,
        duration: course.duration,
        price: course.price
      };
    })
  );

  return {
    type: 'courses',
    totalCourses: courses.length,
    data: courseReports
  };
}