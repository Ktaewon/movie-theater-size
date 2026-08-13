"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowDownUpIcon, SearchIcon, Columns2Icon } from "lucide-react";
import type { ScreenView, SortDir, SortKey } from "@/lib/types";
import {
  CHAIN_LABEL,
  REGIONS,
  TYPE_LABEL,
  type Chain,
  type Region,
  type ScreenType,
} from "@/lib/types";
import { formatArea, formatMeters, isSeatEstimate } from "@/lib/format";
import { ScaleVisual } from "./ScaleVisual";
import { CompareTray } from "./CompareTray";
import { TrustBadge } from "./TrustBadge";
import { OfficialSeatMapLink } from "./OfficialSeatMapLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const QUICK_TYPES: Array<ScreenType | "all"> = [
  "all",
  "imax",
  "dolby",
  "superplex",
  "mx",
  "screenx",
  "4dx",
];

export function CompareApp({ initialScreens }: { initialScreens: ScreenView[] }) {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [chain, setChain] = useState<Chain | "all">("all");
  const [region, setRegion] = useState<Region | "all">("all");
  const [type, setType] = useState<ScreenType | "all">("all");
  const [hasSize, setHasSize] = useState(true);
  const [hideEstimates, setHideEstimates] = useState(false);
  const [sort, setSort] = useState<SortKey>("area");
  const [dir, setDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trayOpen, setTrayOpen] = useState(false);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    let list = [...initialScreens];
    const query = deferredQ.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (v) =>
          v.theater.name.toLowerCase().includes(query) ||
          v.name.toLowerCase().includes(query) ||
          v.theater.city.toLowerCase().includes(query),
      );
    }
    if (chain !== "all") list = list.filter((v) => v.theater.chain === chain);
    if (region !== "all") list = list.filter((v) => v.theater.region === region);
    if (type !== "all") list = list.filter((v) => v.type === type);
    if (hasSize) list = list.filter((v) => v.areaM2 != null);
    if (hideEstimates) list = list.filter((v) => !isSeatEstimate(v.measurement?.source));

    const mul = dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const pick = (v: ScreenView): number | string | null => {
        if (sort === "area") return v.areaM2;
        if (sort === "width") return v.measurement?.widthM ?? null;
        if (sort === "height") return v.measurement?.heightM ?? null;
        if (sort === "seats") return v.seatCount ?? null;
        return `${v.theater.name} ${v.name}`;
      };
      const av = pick(a);
      const bv = pick(b);
      if (av == null && bv == null) return a.theater.name.localeCompare(b.theater.name, "ko");
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "string" && typeof bv === "string") return mul * av.localeCompare(bv, "ko");
      return mul * (Number(av) - Number(bv));
    });
    return list;
  }, [initialScreens, deferredQ, chain, region, type, hasSize, hideEstimates, sort, dir]);

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => initialScreens.find((s) => s.id === id))
        .filter(Boolean) as ScreenView[],
    [selectedIds, initialScreens],
  );

  function toggleSelect(id: string) {
    startTransition(() => {
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 4) return prev;
        return [...prev, id];
      });
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">필터</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(v) => v && setType(v as ScreenType | "all")}
            variant="outline"
            size="sm"
            className="flex flex-wrap justify-start"
          >
            {QUICK_TYPES.map((t) => (
              <ToggleGroupItem key={t} value={t} className="px-3">
                {t === "all" ? "전체" : TYPE_LABEL[t]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="지점, 상영관, 도시 검색"
                className="pl-8"
              />
            </div>
            <div className="md:col-span-2">
              <Select value={chain} onValueChange={(v) => setChain(v as Chain | "all")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="체인" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">체인 전체</SelectItem>
                  <SelectItem value="cgv">CGV</SelectItem>
                  <SelectItem value="lotte">롯데시네마</SelectItem>
                  <SelectItem value="megabox">메가박스</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={region} onValueChange={(v) => setRegion(v as Region | "all")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">지역 전체</SelectItem>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">면적</SelectItem>
                  <SelectItem value="width">가로</SelectItem>
                  <SelectItem value="height">세로</SelectItem>
                  <SelectItem value="seats">좌석</SelectItem>
                  <SelectItem value="name">이름</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))}
              >
                <ArrowDownUpIcon />
                {dir === "desc" ? "내림" : "오름"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={hasSize} onCheckedChange={(v) => setHasSize(v === true)} />
              크기 데이터가 있는 상영관만
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={hideEstimates} onCheckedChange={(v) => setHideEstimates(v === true)} />
              추정값 숨기기
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground tabular-nums">
                {filtered.length}개 · 선택 {selected.length}/4
              </span>
              <Button
                type="button"
                size="sm"
                variant={selected.length ? "default" : "outline"}
                disabled={selected.length === 0}
                onClick={() => setTrayOpen(true)}
              >
                <Columns2Icon />
                비교 보기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScaleVisual
        screens={selected.length > 0 ? selected : filtered.slice(0, 5)}
        title={selected.length > 0 ? "선택한 상영관 스케일" : "상위 결과 미리보기"}
      />

      <Card className="overflow-hidden py-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">선택</TableHead>
                <TableHead>영화관 / 상영관</TableHead>
                <TableHead>타입</TableHead>
                <TableHead>가로 × 세로</TableHead>
                <TableHead>면적</TableHead>
                <TableHead>좌석</TableHead>
                <TableHead>신뢰도</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => {
                const checked = selectedIds.includes(s.id);
                const unknown = s.areaM2 == null;
                return (
                  <TableRow key={s.id} data-state={checked ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={checked}
                        disabled={!checked && selectedIds.length >= 4}
                        onCheckedChange={() => toggleSelect(s.id)}
                        aria-label="비교에 추가"
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={`/screens/${s.id}`} className="font-medium hover:underline">
                        {s.theater.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {CHAIN_LABEL[s.theater.chain]} · {s.theater.region} {s.theater.city} ·{" "}
                        {s.name}
                        {s.theater.officialUrl ? (
                          <>
                            {" · "}
                            <OfficialSeatMapLink href={s.theater.officialUrl} compact />
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{TYPE_LABEL[s.type]}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {unknown ? (
                        <Button asChild variant="link" size="sm" className="h-auto px-0">
                          <Link href={`/report?screenId=${s.id}`}>크기 제보</Link>
                        </Button>
                      ) : (
                        <>
                          {formatMeters(s.measurement?.widthM)} ×{" "}
                          {formatMeters(s.measurement?.heightM)}
                          {isSeatEstimate(s.measurement?.source) ? (
                            <span className="text-muted-foreground" title="좌석배치 기반 추정">
                              *
                            </span>
                          ) : null}
                          {s.measurement?.widthScopeM ? (
                            <div className="text-[11px] text-muted-foreground">
                              SCOPE {formatMeters(s.measurement.widthScopeM)} ×{" "}
                              {formatMeters(s.measurement.heightScopeM)}
                            </div>
                          ) : null}
                        </>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatArea(s.areaM2)}</TableCell>
                    <TableCell className="tabular-nums">{s.seatCount ?? "—"}</TableCell>
                    <TableCell>
                      <TrustBadge
                        compact
                        source={s.measurement?.source}
                        confidence={s.measurement?.confidence}
                        verifiedAt={s.measurement?.verifiedAt}
                        sourceLabel={s.measurement?.sourceLabel}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            조건에 맞는 상영관이 없습니다.
          </div>
        ) : null}
      </Card>

      <CompareTray
        selected={selected}
        open={trayOpen}
        onOpenChange={setTrayOpen}
        onRemove={(id) => setSelectedIds((prev) => prev.filter((x) => x !== id))}
        onClear={() => setSelectedIds([])}
      />
    </div>
  );
}
