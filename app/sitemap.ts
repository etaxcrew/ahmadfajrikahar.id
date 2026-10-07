import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** sitemap.xml — situs satu halaman; section diakses lewat anchor, jadi cukup satu URL */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${getSiteUrl()}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
