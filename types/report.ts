export type PaymentStatus = 'paid' | 'unpaid' | 'overdue';
export type ReportType = 'students' | 'payments' | 'courses';

export interface StudentReport {
  name: string;
  phone: string;
  course: string;
  startDate: Date;
  paymentStatus: PaymentStatus;
  lastPaymentDate?: Date;
}

export interface PaymentReport {
  studentName: string;
  course: string;
  amount: number;
  paymentDate?: Date;
}

export interface CourseReport {
  courseName: string;
  totalStudents: number;
  paidStudents: number;
  revenue: number;
  duration: number;
  price: number;
}

export interface StudentsReportResponse {
  type: 'students';
  total: number;
  data: StudentReport[];
}

export interface PaymentsReportResponse {
  type: 'payments';
  totalRevenue: number;
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
  payments: PaymentReport[];
}

export interface CoursesReportResponse {
  type: 'courses';
  totalCourses: number;
  data: CourseReport[];
}

export type ReportResponse = StudentsReportResponse | PaymentsReportResponse | CoursesReportResponse;