import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//  Specify protected and public routes
const publicRoutes = ['/login', '/register']
const publicRoutePrefixes = ["/show"];


export function proxy(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");
  const path = request.nextUrl.pathname;

  const isPublicRoute =
    publicRoutes.includes(path) ||
    publicRoutePrefixes.some((prefix) => path.startsWith(prefix));
  
  // ✅ allow public routes without login
  if (!token && isPublicRoute) {
    return NextResponse.next();
  }

  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && (publicRoutes.includes(path) || path === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Routes Proxy should not run on
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}