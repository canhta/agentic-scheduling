import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/admin'];
  
  // Define public auth routes that don't require authentication
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/callback'];
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/unauthorized'];
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);
  
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const tokenExpiry = request.cookies.get('auth_token_expiry')?.value;
  
  // Check if token is expired
  let isTokenValid = false;
  if (token && tokenExpiry) {
    const expiryTime = parseInt(tokenExpiry);
    isTokenValid = Date.now() < expiryTime;
  } else if (token) {
    // If we have a token but no expiry, assume it's valid for now
    isTokenValid = true;
  }
  
  // If accessing protected route without valid token, redirect to login
  if (isProtectedRoute && !isTokenValid) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // If accessing auth routes with valid token, redirect to admin (except callback)
  if (isAuthRoute && isTokenValid && !path.startsWith('/auth/callback')) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    const targetUrl = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/admin';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
