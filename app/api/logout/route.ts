// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('next-auth.session-token', '', {
    maxAge: -1,
    path: '/',
  });

  response.cookies.set('next-auth.csrf-token', '', {
    maxAge: -1,
    path: '/',
  });

  response.cookies.set('token', '', {
    maxAge: -1,
    path: '/',
  });

  response.cookies.set('user', '', {
    maxAge: -1,
    path: '/',
  });

  return response;
}
