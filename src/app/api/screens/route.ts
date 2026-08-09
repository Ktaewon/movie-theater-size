import { NextResponse } from "next/server";
import { listScreenViews } from "@/lib/data/store";
import type { Chain, Region, ScreenFilters, ScreenType, SortDir, SortKey } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: ScreenFilters = {
    q: searchParams.get("q") ?? undefined,
    chain: (searchParams.get("chain") as Chain | "all") || "all",
    region: (searchParams.get("region") as Region | "all") || "all",
    type: (searchParams.get("type") as ScreenType | "all") || "all",
    hasSize: searchParams.get("hasSize") === "1",
    sort: (searchParams.get("sort") as SortKey) || "area",
    dir: (searchParams.get("dir") as SortDir) || "desc",
  };
  const screens = await listScreenViews(filters);
  return NextResponse.json({ screens });
}
