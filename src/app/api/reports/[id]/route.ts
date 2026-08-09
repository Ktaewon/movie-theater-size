import { NextResponse } from "next/server";
import { reviewMeasurement } from "@/lib/data/store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== "dev-admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
  const { id } = await context.params;
  const body = (await request.json()) as {
    status: "approved" | "rejected";
    reviewNote?: string;
  };
  if (body.status !== "approved" && body.status !== "rejected") {
    return NextResponse.json({ error: "잘못된 상태입니다." }, { status: 400 });
  }
  const result = await reviewMeasurement(id, body.status, body.reviewNote);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
