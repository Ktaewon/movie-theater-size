import type { Metadata } from "next";
import { ReportForm } from "@/components/ReportForm";
import { getScreenView, listTheaters } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "스크린 제보",
  description:
    "영화관 스크린 가로·세로 수치를 제보해 주세요. 관리자 승인 후 비교에 반영됩니다.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/report" },
};

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ screenId?: string; theaterId?: string }>;
}) {
  const sp = await searchParams;
  const theaters = await listTheaters();
  const screen = sp.screenId ? await getScreenView(sp.screenId) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">스크린 제보</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          가로·세로는 미터(m) 단위로 입력해 주세요. 제출 즉시 공개되지 않으며, 관리자 승인 후 비교에
          반영됩니다.
        </p>
      </div>
      <ReportForm
        theaters={theaters}
        defaultScreenId={sp.screenId}
        defaultTheaterId={sp.theaterId ?? screen?.theaterId}
        screenLabel={screen ? `${screen.theater.name} · ${screen.name}` : undefined}
      />
    </div>
  );
}
