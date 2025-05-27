import { NextRequest, NextResponse } from 'next/server';
import Cookies from 'js-cookie';

const baseURL = 'http://localhost:3001/';

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('unsisToken')?.value;

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('1');

    return NextResponse.redirect(new URL('/', request.url));
  }

  if (request.nextUrl.pathname == '/') {
    const response: any = await validateToken(request);

    if (response) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const response: any = await validateToken(request);
  if (!response) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

async function validateToken(request: any) {
  const cookie = request.cookies.get('unsisToken');
  const token = cookie && cookie.value;

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${baseURL}sesion/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
    
    return response.status == 200;
  } catch (error) {
    console.log(error);
    Cookies.remove('unsisToken');
    return false;
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
