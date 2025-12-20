import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token");

  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  console.log("Proxy running:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/cart", "/order", "/cart", "/wishlist"],
};
