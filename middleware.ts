import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes - authentication kerak emas
const PUBLIC_ROUTES = ['/signup', '/login'];

// API routes - backend tomonidan protect qilinadi
const API_ROUTES = ['/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes uchun middleware skip
  if (API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Static files uchun middleware skip
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // .css, .js, .jpg, etc.
  ) {
    return NextResponse.next();
  }

  // Public routes - authentication check kerak emas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔒 XAVFSIZLIK: Token check qilish
  // Note: middleware da localStorage yo'q, shuning uchun cookie ishlatamiz
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // Token yo'q - signup page ga redirect
    const signupUrl = new URL('/signup', request.url);

    // Redirect qilganidan keyin qaytish uchun current URL ni saqlash
    signupUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(signupUrl);
  }

  // Token bor - davom ettirish
  return NextResponse.next();
}

// Middleware qaysi routelarga apply qilinishi
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
