import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/merchant/", "/api/"],
      },
    ],
    sitemap: "https://mibu-travel.com/sitemap.xml",
  };
}
