import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_ORIGIN = "https://mibu-travel.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host.includes(".replit.app")) {
    // 放行 robots.txt，讓爬蟲能讀到 Disallow: /
    if (request.nextUrl.pathname === "/robots.txt") {
      return NextResponse.next();
    }

    // 其餘所有請求 301 轉到正式網域
    const url = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      CANONICAL_ORIGIN,
    );
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.jpg).*)"],
};
