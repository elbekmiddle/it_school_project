import { Types } from "mongoose";

export interface IStudentType {
  _id: string;
  name: string;
  phone: string;
  course: {
    _id: string;
    title: string;
    price: number;
    duration: number;
    status: "active" | "inactive";
  } | null;
  startDate: string;
  paymentStatus: "paid" | "unpaid" | "overdue";
  lastPaymentDate: string | null;
  paymentAmount: number | null;
  instructorId?: string;
}
