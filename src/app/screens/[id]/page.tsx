import Link from "next/link";
import { notFound } from "next/navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { ScaleVisual } from "@/components/ScaleVisual";
import { OfficialSeatMapLink } from "@/components/OfficialSeatMapLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getScreenView, listHistory } from "@/lib/data/store";
import { formatArea, formatAspect, formatDate, formatMeters } from "@/lib/format";
import { CHAIN_LABEL, TYPE_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ScreenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const screen = await getScreenView(id);
  if (!screen) notFound();
  const history = await listHistory(id);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/#compare">← 비교로</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{CHAIN_LABEL[screen.theater.chain]}</Badge>
          <Badge variant="outline">{TYPE_LABEL[screen.type]}</Badge>
          <span className="text-sm text-muted-foreground">
            {screen.theater.region} {screen.theater.city}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{screen.theater.name}</h1>
        <p className="text-muted-foreground">
          {screen.name}
          {screen.hallNumber ? ` · ${screen.hallNumber}` : ""}
        </p>
        <p className="text-sm text-muted-foreground">{screen.theater.address}</p>
        {screen.theater.officialUrl ? (
          <p className="text-xs text-muted-foreground">
            공식 극장 페이지에서 회차를 고르면 해당 관의 좌석배치도를 볼 수 있습니다.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          {
            label: "가로 × 세로",
            value: `${formatMeters(screen.measurement?.widthM)} × ${formatMeters(screen.measurement?.heightM)}${screen.measurement?.source === "seat_estimate" ? "*" : ""}`,
          },
          { label: "면적", value: formatArea(screen.areaM2) },
          { label: "화면비", value: formatAspect(screen.aspectRatio) },
          { label: "좌석", value: screen.seatCount != null ? String(screen.seatCount) : "—" },
        ].map((item) => (
          <Card key={item.label} size="sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {screen.measurement?.widthScopeM ? (
        <p className="text-sm text-muted-foreground">
          SCOPE: {formatMeters(screen.measurement.widthScopeM)} ×{" "}
          {formatMeters(screen.measurement.heightScopeM)}
        </p>
      ) : null}

      <div className="space-y-2">
        <TrustBadge
          source={screen.measurement?.source}
          confidence={screen.measurement?.confidence}
          verifiedAt={screen.measurement?.verifiedAt}
          sourceLabel={screen.measurement?.sourceLabel}
        />
        {screen.measurement?.note ? (
          <p className="text-sm text-muted-foreground">{screen.measurement.note}</p>
        ) : null}
        {screen.measurement?.source === "seat_estimate" ? (
          <p className="text-xs text-muted-foreground">
            * 좌석배치와 커뮤니티 화면비로 추정한 값입니다. 실측·공식 수치가 있으면 제보해 주세요.
          </p>
        ) : null}
        {screen.measurement?.sourceUrl ? (
          <Button asChild variant="link" className="h-auto px-0">
            <a href={screen.measurement.sourceUrl} target="_blank" rel="noreferrer">
              출처 링크
            </a>
          </Button>
        ) : null}
      </div>

      {screen.areaM2 == null ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">크기 데이터가 아직 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              문의·실측·공개 자료를 제보해 주시면 검토 후 반영합니다.
            </p>
            <Button asChild>
              <Link href={`/report?screenId=${screen.id}`}>크기 제보하기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScaleVisual screens={[screen]} title="이 상영관 스케일" />
      )}

      <div className="flex flex-wrap gap-2">
        {screen.theater.officialUrl ? (
          <OfficialSeatMapLink href={screen.theater.officialUrl} />
        ) : null}
        <Button asChild variant="outline">
          <Link href={`/report?screenId=${screen.id}`}>수치 수정 제보</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/#compare">목록으로</Link>
        </Button>
      </div>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">측정 이력</h2>
        <Card className="py-0">
          <CardContent className="divide-y p-0">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-medium">{h.status}</span>
                  {" · "}
                  {formatMeters(h.widthM)} × {formatMeters(h.heightM)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {h.sourceLabel} · {formatDate(h.verifiedAt)} · {h.confidence}
                </span>
              </div>
            ))}
            {history.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">이력이 없습니다.</p>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
