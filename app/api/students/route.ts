import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Course from "@/models/Course";

// GET all students
export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find().populate("course");
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error("GET students error:", error);
    return NextResponse.json({ success: false, message: "Server xatosi" }, { status: 500 });
  }
}

// POST new student
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const courseExists = await Course.findById(body.course);
    if (!courseExists) {
      return NextResponse.json({ success: false, message: "Kurs topilmadi" }, { status: 400 });
    }

    const newStudent = await Student.create({
      name: body.name,
      phone: body.phone,
      course: body.course,
      startDate: body.startDate,
      paymentStatus: "unpaid",
    });

    return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
  } catch (error) {
    console.error("POST student error:", error);
    return NextResponse.json({ success: false, message: "Server xatosi" }, { status: 500 });
  }
}

// PUT update student
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, ...rest } = await req.json();

    const updated = await Student.findByIdAndUpdate(id, rest, { new: true }).populate("course", "title");
    if (!updated) {
      return NextResponse.json({ success: false, message: "Student topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT student error:", error);
    return NextResponse.json({ success: false, message: "Server xatosi" }, { status: 500 });
  }
}

// DELETE student
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Student topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "O‘chirildi" });
  } catch (error) {
    console.error("DELETE student error:", error);
    return NextResponse.json({ success: false, message: "Server xatosi" }, { status: 500 });
  }
}

// PATCH pay student
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, amount, month } = await req.json();

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ success: false, message: "Student topilmadi" }, { status: 404 });
    }

    student.paymentStatus = "paid";
    student.lastPaymentDate = new Date();
    student.paymentAmount = amount;

    await student.save();

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("PATCH student error:", error);
    return NextResponse.json({ success: false, message: "Server xatosi" }, { status: 500 });
  }
}
