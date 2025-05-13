import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, JwtPayload } from '@/lib/auth/jwtUtils'; // Adjust path if your jwtUtils is elsewhere

// const JWT_SECRET = process.env.JWT_SECRET; // Not strictly needed here anymore if verifyToken handles it

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard', '/settings']; // Add any other routes you want to protect
// const publicRoutes = ['/login', '/signup', '/api/auth/login', '/api/auth/signup', '/api/setup-db', '/']; // Add your home page if it's public

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js specific paths and static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  let userPayload: JwtPayload | null = null;
  if (token) { // JWT_SECRET check is inside verifyToken
    userPayload = verifyToken(token); // Removed await
  }

  // 2. Redirect to login if trying to access a protected route without a valid token
  if (protectedRoutes.some(path => pathname.startsWith(path)) && !userPayload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: add a redirect query param
    return NextResponse.redirect(loginUrl);
  }

  // 3. Redirect to a default protected page (e.g., dashboard) if trying to access auth pages (login/signup) when already logged in
  if (userPayload && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Or your main app page
  }

  // Add user payload to request headers if you want to access it in API routes or Server Components
  // const requestHeaders = new Headers(request.headers);
  // if (userPayload) {
  //   requestHeaders.set('x-user-payload', JSON.stringify(userPayload));
  // }
  // return NextResponse.next({
  //   request: {
  //     headers: requestHeaders,
  //   },
  // });

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - we handle API auth separately or allow some public API routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * We will handle specific API route protection within the routes themselves if needed,
     * or adjust the matcher if all /api routes should pass through middleware by default.
     * For now, public API routes like login/signup are explicitly in publicRoutes.
     */
    // '/(?!api|_next/static|_next/image|favicon.ico).*', // A common, more restrictive matcher
    '/((?!_next/static|_next/image|favicon.ico).*)', // Simpler matcher, catches API routes too, which we handle in logic
  ],
}; 