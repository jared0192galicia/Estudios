import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // const isAuthenticated = request.cookies.get('token')?.value;

  // if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  // matcher: ['/dashboard/:path*'],
};
