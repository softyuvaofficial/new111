// middleware.js
import { NextResponse } from "next/server";

// Define routes accessible only by admin
const adminRoutes = [
  "/admin",
  "/admin/dashboard",
  "/admin/tests",
  "/admin/questions",
  "/admin/users",
  "/admin/reports",
  "/admin/notifications",
];

// Define routes that require user to be logged in (student panel protected routes)
const protectedUserRoutes = [
  "/profile",
  "/test-attempt",
  "/result",
  "/leaderboard",
  "/test-series",
];

// Helper to check if URL starts with a given path
function startsWithAny(url, paths) {
  return paths.some((path) => url.startsWith(path));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public pages without auth
  if (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/test-series") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token"); // Assuming you store JWT in 'token' cookie
  const role = request.cookies.get("role");   // Store user role in cookie: 'admin' or 'user'

  // If trying to access admin routes
  if (startsWithAny(pathname, adminRoutes)) {
    if (!token || role !== "admin") {
      // Redirect to admin login
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect user routes
  if (startsWithAny(pathname, protectedUserRoutes)) {
    if (!token || !role || role === "admin") {
      // Redirect to user login
      const url = new URL("/auth", request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Default: allow request
  return NextResponse.next();
}

// Specify paths where this middleware applies
export const config = {
  matcher: [
    /*
      Match all protected admin and user paths and the root
      Customize this array based on your app routing
    */
    "/admin/:path*",
    "/profile/:path*",
    "/test-attempt/:path*",
    "/result/:path*",
    "/leaderboard/:path*",
    "/test-series/:path*",
  ],
};
