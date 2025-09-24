import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course, { ICourse } from "@/models/Course";

await dbConnect();

export async function GET() {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Partial<ICourse> = await req.json();
    if (!body.title || !body.duration || !body.price) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: Partial<ICourse> & { _id?: string } = await req.json();
    if (!body._id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }
    const course = await Course.findByIdAndUpdate(body._id, body, { new: true });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Course deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
