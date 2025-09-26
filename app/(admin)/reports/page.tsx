'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ReportResponse, ReportType } from '@/types/report';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface Instructor {
	_id: string;
	name: string;
	email: string;
}

interface Course {
	_id: string;
	title: string;
}

export default function ReportsPage() {
	const [reportType, setReportType] = useState<ReportType>('payments');
	const [instructorId, setInstructorId] = useState<string>('all');
	const [courseId, setCourseId] = useState<string>('all');
	const [instructors, setInstructors] = useState<Instructor[]>([]);
	const [courses, setCourses] = useState<Course[]>([]);
	const [reportData, setReportData] = useState<ReportResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [chartData, setChartData] = useState<any>(null);

	// O'qituvchilar va kurslarni olish
	useEffect(() => {
		const fetchData = async () => {
			try {
				// O'qituvchilarni olish
				const instructorsResponse = await fetch('/api/instructors');
				if (instructorsResponse.ok) {
					const instructorsData = await instructorsResponse.json();
					setInstructors(instructorsData);
				}

				// Kurslarni olish
				const coursesResponse = await fetch('/api/courses');
				if (coursesResponse.ok) {
					const coursesData = await coursesResponse.json();
					setCourses(coursesData);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	// Report ma'lumotlarini olish
	useEffect(() => {
		const fetchReportData = async () => {
			try {
				setIsLoading(true);
				const params = new URLSearchParams({ type: reportType });
				
				if (instructorId !== 'all') {
					params.append('instructorId', instructorId);
				}
				
				if (courseId !== 'all') {
					params.append('courseId', courseId);
				}

				const response = await fetch(`/api/reports?${params}`);

				if (!response.ok) throw new Error('Failed to fetch report data');

				const data: ReportResponse = await response.json();
				setReportData(data);

				// Real chart ma'lumotlarini yaratish
				generateChartData(data);
			} catch (error) {
				console.error('Error fetching report data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchReportData();
	}, [reportType, instructorId, courseId]);

	// Real chart ma'lumotlarini yaratish
	const generateChartData = (data: ReportResponse) => {
		const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
		
		if (data.type === 'payments') {
			// To'lovlar bo'yicha chart
			const monthlyData = Array(12).fill(0);
			
			data.payments?.forEach(payment => {
				if (payment.paymentDate) {
					const month = new Date(payment.paymentDate).getMonth();
					monthlyData[month] += payment.amount;
				}
			});

			setChartData({
				labels: months,
				datasets: [
					{
						label: 'Oylik daromad (so`m)',
						data: monthlyData,
						backgroundColor: 'rgba(59, 130, 246, 0.6)',
						borderColor: 'rgba(59, 130, 246, 1)',
						borderWidth: 1,
					},
				],
			});
		} else if (data.type === 'students') {
			// O'quvchilar bo'yicha chart
			const monthlyData = Array(12).fill(0);
			const currentYear = new Date().getFullYear();
			
			data.data?.forEach(student => {
				const studentDate = new Date(student.startDate);
				if (studentDate.getFullYear() === currentYear) {
					const month = studentDate.getMonth();
					monthlyData[month]++;
				}
			});

			setChartData({
				labels: months,
				datasets: [
					{
						label: 'Yangi o\'quvchilar',
						data: monthlyData,
						backgroundColor: 'rgba(34, 197, 94, 0.6)',
						borderColor: 'rgba(34, 197, 94, 1)',
						borderWidth: 1,
					},
				],
			});
		} else if (data.type === 'courses') {
			// Kurslar bo'yicha chart
			const courseNames = data.data?.map(course => course.courseName) || [];
			const studentCounts = data.data?.map(course => course.totalStudents) || [];

			setChartData({
				labels: courseNames,
				datasets: [
					{
						label: 'O\'quvchilar soni',
						data: studentCounts,
						backgroundColor: 'rgba(168, 85, 247, 0.6)',
						borderColor: 'rgba(168, 85, 247, 1)',
						borderWidth: 1,
					},
				],
			});
		}
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: 'top' as const },
			title: { 
				display: true,
				text: reportType === 'payments' ? 'Oylik daromad' : 
							reportType === 'students' ? 'Yangi o\'quvchilar' : 
							'Kurslar bo\'yicha o\'quvchilar soni'
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	const handleExport = async () => {
		try {
			const exportData: any = { reportType };
			
			if (instructorId !== 'all') {
				exportData.instructorId = instructorId;
			}
			
			if (courseId !== 'all') {
				exportData.courseId = courseId;
			}

			const response = await fetch('/api/reports/export', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(exportData),
			});

			if (!response.ok) throw new Error('Export failed');

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${reportType}-hisobot.xlsx`;
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Export error:', error);
			alert('Eksport qilishda xatolik');
		}
	};

	const clearFilters = () => {
		setInstructorId('all');
		setCourseId('all');
	};

	return (
		<div className='p-4 md:p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
				<h1 className='text-xl md:text-2xl font-semibold'>Hisobotlar</h1>
				<div className='flex gap-2'>
					<Button 
						variant="outline" 
						onClick={clearFilters}
						className='cursor-pointer'
					>
						Filtirlarni tozalash
					</Button>
					<Button onClick={handleExport} className='cursor-pointer'>
						Excel ga yuklab olish
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Select
					value={reportType}
					onValueChange={(value: ReportType) => setReportType(value)}
				>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Hisobot turi' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='students'>O`quvchilar</SelectItem>
						<SelectItem value='payments'>To`lovlar</SelectItem>
						<SelectItem value='courses'>Kurslar</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={instructorId}
					onValueChange={setInstructorId}
				>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='O`qituvchi' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Barcha o`qituvchilar</SelectItem>
						{instructors.map(instructor => (
							<SelectItem key={instructor._id} value={instructor._id}>
								{instructor.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={courseId}
					onValueChange={setCourseId}
				>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Kurs' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Barcha kurslar</SelectItem>
						{courses.map(course => (
							<SelectItem key={course._id} value={course._id}>
								{course.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className='flex items-center text-sm text-gray-500'>
					{instructorId !== 'all' || courseId !== 'all' ? (
						<span>Filtirlar qo`llanmoqda</span>
					) : (
						<span>Barcha ma`lumotlar</span>
					)}
				</div>
			</div>

			{/* Statistics Cards */}
			{reportData && (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{reportData.type === 'payments' && (
						<>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>Jami daromad</h3>
								<p className='text-2xl font-bold text-green-600'>
									{reportData.totalRevenue?.toLocaleString()} so`m
								</p>
							</div>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>To`langan to`lovlar</h3>
								<p className='text-2xl font-bold text-blue-600'>
									{reportData.paidCount}
								</p>
							</div>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>To`lanmagan to`lovlar</h3>
								<p className='text-2xl font-bold text-red-600'>
									{reportData.unpaidCount}
								</p>
							</div>
						</>
					)}
					{reportData.type === 'students' && (
						<>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>Jami o`quvchilar</h3>
								<p className='text-2xl font-bold text-blue-600'>
									{reportData.total}
								</p>
							</div>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>Aktiv o`quvchilar</h3>
								<p className='text-2xl font-bold text-green-600'>
									{reportData.data?.filter(s => s.paymentStatus === 'paid').length || 0}
								</p>
							</div>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>Yangi o`quvchilar (oylik)</h3>
								<p className='text-2xl font-bold text-orange-600'>
									{reportData.data?.filter(student => {
										const studentDate = new Date(student.startDate);
										const currentDate = new Date();
										return studentDate.getMonth() === currentDate.getMonth() &&
											studentDate.getFullYear() === currentDate.getFullYear();
									}).length || 0}
								</p>
							</div>
						</>
					)}
					{reportData.type === 'courses' && (
						<>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>Jami kurslar</h3>
								<p className='text-2xl font-bold text-blue-600'>
									{reportData.totalCourses}
								</p>
							</div>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>Aktiv kurslar</h3>
								<p className='text-2xl font-bold text-green-600'>
									{reportData.data?.filter(c => c.totalStudents > 0).length || 0}
								</p>
							</div>
							<div className='bg-white p-4 rounded-2xl shadow'>
								<h3 className='text-sm text-gray-500'>Umumiy daromad</h3>
								<p className='text-2xl font-bold text-purple-600'>
									{reportData.data?.reduce((sum, course) => sum + course.revenue, 0).toLocaleString()} so`m
								</p>
							</div>
						</>
					)}
				</div>
			)}

			{/* Chart */}
			<div className='bg-white p-4 rounded-2xl shadow h-[300px] md:h-[400px]'>
				{chartData ? (
					<Bar data={chartData} options={options} />
				) : (
					<div className='flex items-center justify-center h-full'>
						<div className='text-gray-500'>Diagramma yuklanmoqda...</div>
					</div>
				)}
			</div>

			{/* Table */}
			<div className='bg-white p-4 rounded-2xl shadow overflow-x-auto'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-base md:text-lg font-medium'>
						{reportType === 'students' && 'O\'quvchilar ro\'yxati'}
						{reportType === 'payments' && 'To\'lovlar tarixi'}
						{reportType === 'courses' && 'Kurslar statistikasi'}
					</h2>
					<span className='text-sm text-gray-500'>
						Jami: {reportData?.type === 'students' ? reportData.total : 
							reportData?.type === 'payments' ? reportData.payments?.length : 
							reportData?.data?.length} ta
					</span>
				</div>

				{isLoading ? (
					<div className='text-center py-8'>Yuklanmoqda...</div>
				) : (
					<table className='w-full border-collapse min-w-[600px]'>
						<thead>
							<tr className='border-b text-left text-sm text-gray-500'>
								{reportType === 'students' && (
									<>
										<th className='p-2'>Ism</th>
										<th className='p-2'>Telefon</th>
										<th className='p-2'>Kurs</th>
										<th className='p-2'>Boshlanish sanasi</th>
										<th className='p-2'>To`lov holati</th>
									</>
								)}
								{reportType === 'payments' && (
									<>
										<th className='p-2'>O`quvchi</th>
										<th className='p-2'>Kurs</th>
										<th className='p-2'>Summa</th>
										<th className='p-2'>Sana</th>
										<th className='p-2'>Holati</th>
									</>
								)}
								{reportType === 'courses' && (
									<>
										<th className='p-2'>Kurs nomi</th>
										<th className='p-2'>O`quvchilar</th>
										<th className='p-2'>To`lov qilganlar</th>
										<th className='p-2'>Daromad</th>
										<th className='p-2'>Foiz</th>
									</>
								)}
							</tr>
						</thead>
						<tbody>
							{reportData?.type === 'students' &&
								reportData.data.slice(0, 10).map((student, index) => (
									<tr key={index} className='border-b text-sm hover:bg-gray-50'>
										<td className='p-2'>{student.name}</td>
										<td className='p-2'>{student.phone}</td>
										<td className='p-2'>{student.course}</td>
										<td className='p-2'>{new Date(student.startDate).toLocaleDateString('uz-UZ')}</td>
										<td className='p-2'>
											<span
												className={`px-2 py-1 rounded-full text-xs ${
													student.paymentStatus === 'paid'
														? 'bg-green-100 text-green-800'
														: student.paymentStatus === 'overdue'
														? 'bg-red-100 text-red-800'
														: 'bg-yellow-100 text-yellow-800'
												}`}
											>
												{student.paymentStatus === 'paid'
													? 'To\'langan'
													: student.paymentStatus === 'overdue'
													? 'Kechikkan'
													: 'To\'lanmagan'}
											</span>
										</td>
									</tr>
								))}

							{reportData?.type === 'payments' &&
								reportData.payments.slice(0, 10).map((payment, index) => (
									<tr key={index} className='border-b text-sm hover:bg-gray-50'>
										<td className='p-2'>{payment.studentName}</td>
										<td className='p-2'>{payment.course}</td>
										<td className='p-2 font-medium'>
											{payment.amount.toLocaleString()} so`m
										</td>
										<td className='p-2'>
											{payment.paymentDate
												? new Date(payment.paymentDate).toLocaleDateString('uz-UZ')
												: '-'}
										</td>
										<td className='p-2'>
											<span className='px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'>
												To`langan
											</span>
										</td>
									</tr>
								))}

							{reportData?.type === 'courses' &&
								reportData.data.map((course, index) => (
									<tr key={index} className='border-b text-sm hover:bg-gray-50'>
										<td className='p-2 font-medium'>{course.courseName}</td>
										<td className='p-2'>{course.totalStudents}</td>
										<td className='p-2'>{course.paidStudents}</td>
										<td className='p-2 font-medium'>
											{course.revenue.toLocaleString()} so`m
										</td>
										<td className='p-2'>
											{course.totalStudents > 0 ? 
												Math.round((course.paidStudents / course.totalStudents) * 100) : 0}%
										</td>
									</tr>
								))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}