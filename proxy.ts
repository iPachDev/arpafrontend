import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "arpa_session";
const protectedRoutes = [
  "/home",
  "/explore",
  "/checkout",
  "/registrations",
  "/teams",
  "/locations",
  "/live",
  "/profile",
];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  if (!isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.has(sessionCookieName)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
