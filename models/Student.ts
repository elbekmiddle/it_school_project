import { Schema, model, models, Types } from "mongoose";

export interface IStudent {
  _id?: string;
  name: string;
  phone: string;
  course: Types.ObjectId; // ObjectId bilan mos
  startDate: Date;
  paymentStatus: "paid" | "unpaid" | "overdue";
  lastPaymentDate?: Date;
  createdAt?: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    startDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: ["paid", "unpaid", "overdue"], default: "unpaid" },
    lastPaymentDate: { type: Date },
  },
  { timestamps: true }
);

export default models.Student || model<IStudent>("Student", studentSchema);
