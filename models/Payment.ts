import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  date: Date;
  studentName: string;
  course: string;
  instructor: string;
  amount: number;
  method: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    date: { type: Date, required: true },
    studentName: { type: String, required: true },
    course: { type: String, required: true },
    instructor: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
