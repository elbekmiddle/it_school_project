import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import ExcelJS from 'exceljs';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Course from '@/models/Course';
import { ReportType } from '@/types/report';

interface ExportRequest {
	reportType: ReportType;
	instructorId?: string;
}

export async function POST(request: NextRequest) {
	return requireAuth(request, ['admin', 'instructor'], async (user) => {
		try {
			await dbConnect();

			const body: ExportRequest = await request.json();
			const { reportType, instructorId } = body;

			if (!reportType || !['students', 'payments', 'courses'].includes(reportType)) {
				return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
			}

			const workbook = new ExcelJS.Workbook();

			// Filter yaratish
			const filter: Record<string, unknown> = {};
			
			// Agar instructor bo'lsa, faqat o'zining ma'lumotlarini ko'rsin
			if (user.role === 'instructor') {
				filter.instructorId = user.id;
			} 
			// Agar admin bo'lsa va instructorId tanlangan bo'lsa
			else if (user.role === 'admin' && instructorId && instructorId !== 'all') {
				filter.instructorId = instructorId;
			}

			if (reportType === 'students') {
				await generateStudentsSheet(workbook, filter);
			} else if (reportType === 'payments') {
				await generatePaymentsSheet(workbook, filter);
			} else if (reportType === 'courses') {
				await generateCoursesSheet(workbook, filter);
			}

			const buffer = await workbook.xlsx.writeBuffer();

			return new NextResponse(buffer, {
				headers: {
					'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'Content-Disposition': `attachment; filename="${reportType}-hisobot.xlsx"`,
				},
			});
		} catch (error) {
			console.error('Export error:', error);
			return NextResponse.json({ error: 'Eksport qilishda xatolik' }, { status: 500 });
		}
	});
}

async function generateStudentsSheet(workbook: ExcelJS.Workbook, filter: Record<string, unknown>) {
	const worksheet = workbook.addWorksheet('O`quvchilar');
	worksheet.addRow([
		'Ism',
		'Telefon',
		'Kurs',
		'Boshlanish sanasi',
		'To`lov holati',
		'Oxirgi to`lov',
	]);

	const students = await Student.find(filter)
		.populate('course', 'title')
		.sort({ createdAt: -1 });

	students.forEach(student => {
		worksheet.addRow([
			student.name,
			student.phone,
			student.course?.title || 'Noma`lum',
			student.startDate.toLocaleDateString('uz-UZ'),
			student.paymentStatus === 'paid'
				? 'To`langan'
				: student.paymentStatus === 'overdue'
				? 'Kechikkan'
				: 'To`lanmagan',
			student.lastPaymentDate
				? student.lastPaymentDate.toLocaleDateString('uz-UZ')
				: '-',
		]);
	});

	// Statistikani qo'shish
	worksheet.addRow([]);
	worksheet.addRow(['Statistika:']);
	worksheet.addRow(['Jami o`quvchilar:', students.length]);
	
	const paidCount = students.filter(s => s.paymentStatus === 'paid').length;
	const unpaidCount = students.filter(s => s.paymentStatus === 'unpaid').length;
	const overdueCount = students.filter(s => s.paymentStatus === 'overdue').length;
	
	worksheet.addRow(['To`langan:', paidCount]);
	worksheet.addRow(['To`lanmagan:', unpaidCount]);
	worksheet.addRow(['Kechikkan:', overdueCount]);

	worksheet.getRow(1).font = { bold: true };
}

async function generatePaymentsSheet(workbook: ExcelJS.Workbook, filter: Record<string, unknown>) {
	const worksheet = workbook.addWorksheet('To`lovlar');
	worksheet.addRow([
		'O`quvchi',
		'Kurs',
		'To`lov summasi',
		'To`lov sanasi',
		'Holati',
	]);

	// Faqat to'langan to'lovlarni olish
	const paymentFilter = { ...filter, paymentStatus: 'paid' };
	
	const students = await Student.find(paymentFilter)
		.populate('course', 'title')
		.sort({ lastPaymentDate: -1 });

	students.forEach(student => {
		worksheet.addRow([
			student.name,
			student.course?.title || 'Nomaʼlum',
			student.paymentAmount || 0,
			student.lastPaymentDate
				? student.lastPaymentDate.toLocaleDateString('uz-UZ')
				: '-',
			student.paymentStatus === 'paid'
				? 'To`langan'
				: student.paymentStatus === 'overdue'
				? 'Kechikkan'
				: 'To`lanmagan',
		]);
	});

	// Statistikani qo'shish
	worksheet.addRow([]);
	worksheet.addRow(['Statistika:']);
	
	const totalRevenue = students.reduce((sum, student) => sum + (student.paymentAmount || 0), 0);
	const totalPayments = students.length;
	
	worksheet.addRow(['Jami daromad:', totalRevenue]);
	worksheet.addRow(['Jami to`lovlar:', totalPayments]);

	worksheet.getRow(1).font = { bold: true };
}

async function generateCoursesSheet(workbook: ExcelJS.Workbook, filter: Record<string, unknown>) {
	const worksheet = workbook.addWorksheet('Kurslar');
	worksheet.addRow([
		'Kurs nomi',
		'Jami o`quvchilar',
		'To`lov qilganlar',
		'Daromad',
		'Narx',
		'Davomiylik',
	]);

	const courses = await Course.find({ status: 'active' });

	for (const course of courses) {
		// Har bir kurs uchun filter
		const courseFilter = { ...filter, course: course._id };
		
		const totalStudents = await Student.countDocuments(courseFilter);
		const paidStudents = await Student.countDocuments({
			...courseFilter,
			paymentStatus: 'paid',
		});

		const paidStudentsData = await Student.find({
			...courseFilter,
			paymentStatus: 'paid',
		});

		const revenue = paidStudentsData.reduce((sum, student) => {
			return sum + (student.paymentAmount || 0);
		}, 0);

		worksheet.addRow([
			course.title,
			totalStudents,
			paidStudents,
			revenue,
			course.price,
			`${course.duration} oy`,
		]);
	}

	// Umumiy statistika
	worksheet.addRow([]);
	worksheet.addRow(['Umumiy statistika:']);
	
	const allStudents = await Student.countDocuments(filter);
	const allPaidStudents = await Student.countDocuments({ ...filter, paymentStatus: 'paid' });
	const allPaidStudentsData = await Student.find({ ...filter, paymentStatus: 'paid' });
	const totalRevenue = allPaidStudentsData.reduce((sum, student) => sum + (student.paymentAmount || 0), 0);
	
	worksheet.addRow(['Jami o`quvchilar:', allStudents]);
	worksheet.addRow(['To`lov qilganlar:', allPaidStudents]);
	worksheet.addRow(['Umumiy daromad:', totalRevenue]);

	worksheet.getRow(1).font = { bold: true };
}