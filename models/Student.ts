import mongoose, { Schema, model, models } from "mongoose";

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    startDate: { type: Date, required: true },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "overdue"],
      default: "unpaid",
    },
    lastPaymentDate: { type: Date },
    paymentAmount: { type: Number },
  },
  { timestamps: true }
);

const Student = models.Student || model("Student", StudentSchema);
export default Student;
