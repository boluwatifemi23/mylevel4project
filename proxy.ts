import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
const authRoutes = ['/login', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  let isAuthenticated = false;

  if (token) {
    try {
      verifyToken(token);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
