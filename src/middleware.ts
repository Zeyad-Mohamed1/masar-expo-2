import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ["/sign-in", "/meeting/", "/", "/developers"];
  const isPublicPath = publicPaths.some(
    (pp) => path === pp || path.startsWith(pp),
  );

  // Define protected paths that require authentication
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some(
    (pp) => path === pp || path.startsWith(pp),
  );

  // Check for session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect logic
  // Specifically protect dashboard routes
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Other protected routes logic
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && path === "/sign-in") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
