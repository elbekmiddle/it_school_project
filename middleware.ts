import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Agar foydalanuvchi '/' yoki '/home' ga kirsa
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard"; // redirect qiladigan path
    return NextResponse.redirect(url);
  }

  // boshqa pathlarga o‘zgartirishsiz ruxsat berish
  return NextResponse.next();
}

// Middleware faqat '/' va boshqa kerakli pathlarga ishlashi uchun matcher
export const config = {
  matcher: ["/"], // kerak bo‘lsa ['/', '/home'] kabi qo‘shish mumkin
};
