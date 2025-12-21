import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/admin")) {
    if (!token || !isAdmin) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  console.log("Proxy running:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/cart/:path*",
    "/order/:path*",
    "/wishlist/:path*",
    "/admin/:path*",
  ],
};
