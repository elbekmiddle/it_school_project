import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";

interface IErrorResponse {
  error: string;
}

// 🔹 Instructorlar ro‘yxati
export async function GET(): Promise<NextResponse<IUser[] | IErrorResponse>> {
  try {
    await dbConnect();
    const instructors = await User.find({ role: { $in: ["instructor", "admin"] } })
      .sort({ createdAt: -1 })
      .lean<IUser[]>();
    return NextResponse.json(instructors);
  } catch {
    return NextResponse.json({ error: "O‘qituvchilarni olishda xato" }, { status: 500 });
  }
}

// 🔹 Yangi instructor qo‘shish
export async function POST(req: NextRequest): Promise<NextResponse<IUser | IErrorResponse>> {
  try {
    await dbConnect();
    const { name, email, phone, password, role } = (await req.json()) as {
      name: string;
      email: string;
      phone?: string;
      password: string;
      role: "admin" | "instructor";
    };

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Majburiy maydonlar to‘ldirilmagan" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Bu email allaqachon mavjud" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    return NextResponse.json(newUser);
  } catch {
    return NextResponse.json({ error: "O‘qituvchi yaratishda xato" }, { status: 500 });
  }
}

// 🔹 Instructorni yangilash
export async function PUT(req: NextRequest): Promise<NextResponse<IUser | IErrorResponse>> {
  try {
    await dbConnect();
    const { _id, name, email, phone, password, role } = (await req.json()) as {
      _id: string;
      name: string;
      email: string;
      phone?: string;
      password?: string;
      role: "admin" | "instructor";
    };

    if (!_id) {
      return NextResponse.json({ error: "ID kiritilmadi" }, { status: 400 });
    }

    // 🔹 TypeScriptga xato bermasligi uchun `Pick<IUser, ...>` ishlatyapmiz
    const updateData: Pick<IUser, "name" | "email" | "phone" | "role"> & Partial<IUser> = {
      name,
      email,
      phone,
      role,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(_id, updateData, { new: true }).lean<IUser | null>();

    if (!updated) {
      return NextResponse.json({ error: "O‘qituvchi topilmadi" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "O‘qituvchini yangilashda xato" }, { status: 500 });
  }
}

// 🔹 Instructorni o‘chirish
export async function DELETE(req: NextRequest): Promise<NextResponse<IErrorResponse>> {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID berilmagan" }, { status: 400 });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "O‘qituvchi topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ error: "O‘qituvchi o‘chirildi" });
  } catch {
    return NextResponse.json({ error: "O‘qituvchini o‘chirishda xato" }, { status: 500 });
  }
}
