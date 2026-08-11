import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matildajewellery.com";

  const staticRoutes = [
    { url: `${baseUrl}/`, changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/shop`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/wishlist`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/policies/shipping`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/policies/returns`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/policies/cancellation`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/policies/privacy`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/policies/terms`, changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  return staticRoutes;
}
