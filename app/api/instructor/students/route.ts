import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Course from '@/models/Course';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  return requireAuth(request, ['instructor'], async (user) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(request.url);
      const courseId = searchParams.get('courseId');
      const paymentStatus = searchParams.get('paymentStatus');

      // Instructorning kurslarini olish
      const instructorCourses = await Course.find({ instructorId: user.id });
      const courseIds = instructorCourses.map(course => course._id);

      // Filter yaratish
      const filter: any = { course: { $in: courseIds } };
      
      if (courseId && courseId !== 'all') {
        filter.course = courseId;
      }
      
      if (paymentStatus && paymentStatus !== 'all') {
        filter.paymentStatus = paymentStatus;
      }

      const students = await Student.find(filter)
        .populate('course', 'title duration price')
        .sort({ createdAt: -1 });

      const studentsWithDetails = students.map(student => ({
        id: student._id,
        name: student.name,
        phone: student.phone,
        course: student.course?.title || 'Noma`lum',
        courseId: student.course?._id,
        startDate: student.startDate,
        paymentStatus: student.paymentStatus,
        lastPaymentDate: student.lastPaymentDate,
        paymentAmount: student.paymentAmount,
        createdAt: student.createdAt
      }));

      // Kurslar ro'yxati (instructorning kurslari)
      const courses = instructorCourses.map(course => ({
        id: course._id,
        title: course.title
      }));

      return NextResponse.json({
        students: studentsWithDetails,
        courses,
        total: students.length
      });

    } catch (error) {
      console.error('Instructor students error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}