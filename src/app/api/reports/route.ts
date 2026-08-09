import { NextResponse } from "next/server";
import { listMeasurements, submitReport } from "@/lib/data/store";
import type { ReportInput } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as "pending" | "approved" | "rejected" | null;
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== "dev-admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
  const reports = await listMeasurements(status ?? undefined);
  return NextResponse.json({ reports });
}

export async function POST(request: Request) {
  const body = (await request.json()) as ReportInput;
  const result = await submitReport(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ id: result.id });
}
