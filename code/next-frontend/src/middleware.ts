import { NextResponse, NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

const ROUTE_ROLES = [
  { pattern: /^\/settings/, roles: ['ADMIN'] },
  { pattern: /^\/branch-dashboard/, roles: ['BRANCH_MANAGER'] },
  
  { pattern: /^\/products/, roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'] },
  { pattern: /^\/categories/, roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'] },
  { pattern: /^\/brands/, roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'] },
  { pattern: /^\/stock/, roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'] },
  { pattern: /^\/inventory/, roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_STAFF'] },
  
  { pattern: /^\/customers/, roles: ['ADMIN', 'BRANCH_MANAGER'] },
  { pattern: /^\/suppliers/, roles: ['ADMIN', 'BRANCH_MANAGER'] },
  { pattern: /^\/employees/, roles: ['ADMIN', 'BRANCH_MANAGER'] },
  { pattern: /^\/reports/, roles: ['ADMIN', 'BRANCH_MANAGER'] },
  
  { pattern: /^\/orders/, roles: ['ADMIN', 'BRANCH_MANAGER', 'CASHIER'] },
  { pattern: /^\/pos/, roles: ['ADMIN', 'CASHIER'] },
  
  { pattern: /^\/tax/, roles: ['ADMIN', 'ACCOUNTANT'] },
  { pattern: /^\/finance/, roles: ['ADMIN', 'ACCOUNTANT'] },
  
  { pattern: /^\/customer/, roles: ['CUSTOMER'] },
];

function getHomePath(role: string) {
  switch (role) {
    case 'ADMIN':
      return '/';
    case 'BRANCH_MANAGER':
      return '/branch-dashboard';
    case 'CASHIER':
      return '/pos';
    case 'INVENTORY_STAFF':
      return '/stock';
    case 'ACCOUNTANT':
      return '/tax';
    case 'CUSTOMER':
      return '/customer';
    default:
      return '/';
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('user_role')?.value;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 1. If not authenticated and trying to access a protected path, redirect to login
  if (!token && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated
  if (token) {
    // If trying to access login/register, redirect to their home page
    if (isPublic) {
      const homeUrl = new URL(getHomePath(role || 'ADMIN'), request.url);
      return NextResponse.redirect(homeUrl);
    }

    // If accessing root `/`, redirect non-ADMINs to their respective dashboard/page
    if (pathname === '/') {
      if (role && role !== 'ADMIN') {
        const homeUrl = new URL(getHomePath(role), request.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    // Check specific path roles rules
    for (const rule of ROUTE_ROLES) {
      if (rule.pattern.test(pathname)) {
        if (!role || !rule.roles.includes(role)) {
          // If role is not allowed, redirect to their home path (or we could show 403, but redirecting is cleaner)
          const forbiddenUrl = new URL(getHomePath(role || 'ADMIN'), request.url);
          // Optional: Add a query parameter to show warning
          forbiddenUrl.searchParams.set('error', 'unauthorized');
          return NextResponse.redirect(forbiddenUrl);
        }
      }
    }
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
