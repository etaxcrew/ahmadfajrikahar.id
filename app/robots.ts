import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** robots.txt — situs publik boleh diindeks seluruhnya kecuali endpoint API */
export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
