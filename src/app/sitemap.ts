import type { MetadataRoute } from "next";
import { listScreenViews } from "@/lib/data/store";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const screens = await listScreenViews({});

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/report`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...screens.map((s) => ({
      url: `${SITE_URL}/screens/${s.id}`,
      lastModified: s.measurement?.verifiedAt
        ? new Date(s.measurement.verifiedAt)
        : s.measurement?.createdAt
          ? new Date(s.measurement.createdAt)
          : new Date(),
      changeFrequency: "monthly" as const,
      priority: s.areaM2 != null ? 0.7 : 0.4,
    })),
  ];
}
