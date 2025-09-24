import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  duration: number; // oy
  price: number;    // oylik to‘lov
  status: "active" | "inactive";
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
