// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // NextAuth token olish
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = req.nextUrl.clone();

  // Agar foydalanuvchi login qilmagan bo‘lsa
  if (!token) {
    // login page ga yo‘naltirish
    if (pathname !== "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Role bo‘yicha yo‘naltirish
  if (pathname === "/") {
    if (token.role === "admin") {
      url.pathname = "/dashboard"; // admin dashboard
      return NextResponse.redirect(url);
    }
    if (token.role === "instructor") {
      url.pathname = "/instructor/dashboard"; // instructor dashboard
      return NextResponse.redirect(url);
    }
  }

  // Agar foydalanuvchi login qilgan bo‘lsa lekin noto‘g‘ri role pagega kirsa
  if (pathname.startsWith("/dashboard") && token.role !== "admin") {
    url.pathname = "/instructor/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/instructor") && token.role !== "instructor") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Middleware qaysi pathlarga ishlaydi
export const config = {
  matcher: ["/", "/dashboard/:path*", "/instructor/:path*"],
};
