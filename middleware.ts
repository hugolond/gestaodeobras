import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req:NextRequest) {
  const path = req.nextUrl.pathname;
  if (path === "/") {
    return NextResponse.next();
  }
  
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!session && path.match("admin")) {
    console.log("redirect pelo middleware")
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
