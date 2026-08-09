import Link from "next/link";
import { CompareApp } from "@/components/CompareApp";
import { Button } from "@/components/ui/button";
import { getStats, listScreenViews } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [screens, stats] = await Promise.all([listScreenViews({}), getStats()]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">ScreenMeter</p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            한국 영화관 스크린을 같은 자로 비교하세요
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            CGV · 롯데시네마 · 메가박스 특별관부터 면적·가로·세로를 정렬하고, 동일 스케일로
            체감을 맞춥니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <a href="#compare">비교 시작</a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/report">스크린 제보</Link>
          </Button>
          <p className="ml-auto text-xs text-muted-foreground tabular-nums">
            크기 확인 {stats.withSize} · 상영관 {stats.screens} · 지점 {stats.theaters}
          </p>
        </div>
      </section>

      <section id="compare" className="scroll-mt-20">
        <CompareApp initialScreens={screens} />
      </section>
    </div>
  );
}
