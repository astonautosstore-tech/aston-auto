import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://astonautostores.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/backdoor", "/admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
