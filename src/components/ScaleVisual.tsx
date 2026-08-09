"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScreenView } from "@/lib/types";
import { CHAIN_LABEL, TYPE_LABEL } from "@/lib/types";
import { formatArea, formatMeters } from "@/lib/format";

const palette = [
  "bg-foreground/90",
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
];

export function ScaleVisual({
  screens,
  maxWidthPx = 560,
  title = "동일 스케일 비교",
  description = "선택한 상영관을 같은 비율로 나란히 표시합니다.",
}: {
  screens: ScreenView[];
  maxWidthPx?: number;
  title?: string;
  description?: string;
}) {
  const sized = screens.filter((s) => s.measurement?.widthM && s.measurement?.heightM);

  if (sized.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>크기 데이터가 있는 상영관을 선택하면 여기에 표시됩니다.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxW = Math.max(...sized.map((s) => s.measurement!.widthM!));
  const maxH = Math.max(...sized.map((s) => s.measurement!.heightM!));
  const scale = Math.min(maxWidthPx / maxW, 220 / maxH);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>
          {description} · {sized.length}개
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border bg-muted/40 p-4 sm:p-6">
          <div className="flex min-h-[180px] flex-wrap items-end justify-center gap-6">
            {sized.map((s, i) => {
              const w = Math.max(s.measurement!.widthM! * scale, 24);
              const h = Math.max(s.measurement!.heightM! * scale, 16);
              const short = s.theater.name.replace(/^(CGV|롯데시네마|메가박스)\s*/, "");
              return (
                <div key={s.id} className="flex max-w-[140px] flex-col items-center gap-2">
                  <div
                    className={`relative rounded-sm border border-border/60 shadow-sm ${palette[i % palette.length]}`}
                    style={{ width: w, height: h }}
                    title={`${s.theater.name} ${s.name}`}
                  >
                    <span className="absolute left-1 top-1 text-[10px] font-medium text-background/80">
                      {i + 1}
                    </span>
                  </div>
                  <div className="text-center text-[11px] leading-snug">
                    <p className="truncate font-medium">
                      {CHAIN_LABEL[s.theater.chain]} · {TYPE_LABEL[s.type]}
                    </p>
                    <p className="truncate text-muted-foreground">{short}</p>
                    <p className="mt-0.5 tabular-nums">
                      {formatMeters(s.measurement!.widthM)} × {formatMeters(s.measurement!.heightM)}
                    </p>
                    <p className="tabular-nums text-muted-foreground">{formatArea(s.areaM2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
