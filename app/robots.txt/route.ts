import { NextRequest, NextResponse } from "next/server";

const CANONICAL_DOMAIN = "mibu-travel.com";

export function GET(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // replit.app 網域：禁止所有爬蟲
  if (host.includes(".replit.app")) {
    const body = [
      "User-agent: *",
      "Disallow: /",
      "",
    ].join("\n");

    return new NextResponse(body, {
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 正式網域：允許爬蟲 + 提供 sitemap
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /merchant/",
    "Disallow: /api/",
    "",
    `Sitemap: https://${CANONICAL_DOMAIN}/sitemap.xml`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
