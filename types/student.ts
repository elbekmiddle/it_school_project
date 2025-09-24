import { ICourse } from "@/models/Course";

export interface IStudentFrontend {
  _id: string;
  name: string;
  phone: string;
  course: ICourse; // populate qilinsa kurs obyekt bo‘ladi
  startDate: string; // frontendda Date string bo‘lib keladi
  paymentStatus: "paid" | "unpaid" | "overdue";
  lastPaymentDate?: string;
  instructorId: string;
}
