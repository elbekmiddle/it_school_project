import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student, { IStudent } from "@/models/Student";
import Course, { ICourse } from "@/models/Course";

// 🔹 GET: barcha studentlar kurs ma’lumotlari bilan
export async function GET() {
  await dbConnect();

  const students = await Student.find()
    .populate<{ course: ICourse | null }>("course", "title price duration status")
    .lean();

  const typedStudents = students as unknown as (IStudent & { course?: ICourse | null })[];

  const formatted = typedStudents.map((s) => ({
    _id: s._id?.toString(),
    name: s.name,
    phone: s.phone,
    course: s.course ? s.course.title : "Noma’lum kurs",
    startDate: s.startDate.toISOString(),
    paymentStatus: s.paymentStatus,
    price: s.course?.price || 0,
    duration: s.course?.duration || 0,
    courseStatus: s.course?.status || "inactive",
  }));

  return NextResponse.json(formatted);
}

// 🔹 POST: yangi student qo‘shish
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body: Omit<IStudent, "_id"> = await req.json();

    const course = await Course.findById(body.course);
    if (!course) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 400 });

    const student = await Student.create(body);
    return NextResponse.json(student, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server xatosi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 🔹 PUT: studentni yangilash
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body: Partial<IStudent> & { _id?: string } = await req.json();

    if (!body._id) return NextResponse.json({ error: "ID kerak" }, { status: 400 });

    if (body.course) {
      const course = await Course.findById(body.course);
      if (!course) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 400 });
    }

    const updated = await Student.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server xatosi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 🔹 DELETE: studentni o‘chirish
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID kerak" }, { status: 400 });

    await Student.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server xatosi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
