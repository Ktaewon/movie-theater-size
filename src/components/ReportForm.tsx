"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ScreenType, Theater } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ReportForm({
  theaters,
  defaultScreenId,
  defaultTheaterId,
  screenLabel,
}: {
  theaters: Theater[];
  defaultScreenId?: string;
  defaultTheaterId?: string;
  screenLabel?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<"existing" | "new">(defaultScreenId ? "existing" : "new");
  const [theaterId, setTheaterId] = useState(defaultTheaterId ?? "");
  const [screenType, setScreenType] = useState<ScreenType>("standard");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      website: String(fd.get("website") || ""),
      screenId:
        mode === "existing"
          ? String(fd.get("screenId") || defaultScreenId || "") || undefined
          : undefined,
      theaterId: mode === "new" ? theaterId || undefined : undefined,
      newScreenName: mode === "new" ? String(fd.get("newScreenName") || "") : undefined,
      newScreenType: mode === "new" ? screenType : undefined,
      widthM: Number(fd.get("widthM")),
      heightM: Number(fd.get("heightM")),
      widthScopeM: fd.get("widthScopeM") ? Number(fd.get("widthScopeM")) : undefined,
      heightScopeM: fd.get("heightScopeM") ? Number(fd.get("heightScopeM")) : undefined,
      seatCount: fd.get("seatCount") ? Number(fd.get("seatCount")) : undefined,
      sourceUrl: String(fd.get("sourceUrl") || "") || undefined,
      note: String(fd.get("note") || "") || undefined,
      reporterName: String(fd.get("reporterName") || "") || undefined,
    };

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      toast.error(data.error || "제보에 실패했습니다.");
      return;
    }
    toast.success("제보가 접수되었습니다. 승인 후 반영됩니다.");
    router.push("/#compare");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">제보 정보</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-5">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as "existing" | "new")}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="existing">기존 상영관</ToggleGroupItem>
            <ToggleGroupItem value="new">신규 상영관</ToggleGroupItem>
          </ToggleGroup>

          {mode === "existing" ? (
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">상영관 ID</label>
              <Input
                name="screenId"
                required
                defaultValue={defaultScreenId}
                placeholder="예: cgv-yongsan-imax"
              />
              {screenLabel ? <p className="text-xs text-muted-foreground">{screenLabel}</p> : null}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs text-muted-foreground">영화관</label>
                <Select value={theaterId} onValueChange={setTheaterId} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="영화관 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {theaters.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">타입</label>
                <Select
                  value={screenType}
                  onValueChange={(v) => setScreenType(v as ScreenType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABEL).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">상영관 이름</label>
                <Input name="newScreenName" required placeholder="예: Dolby Cinema" />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">가로 (m)</label>
              <Input name="widthM" type="number" step="0.01" min="0.1" max="100" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">세로 (m)</label>
              <Input name="heightM" type="number" step="0.01" min="0.1" max="100" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">가로 Scope (선택)</label>
              <Input name="widthScopeM" type="number" step="0.01" min="0.1" max="100" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">세로 Scope (선택)</label>
              <Input name="heightScopeM" type="number" step="0.01" min="0.1" max="100" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">좌석 수 (선택)</label>
              <Input name="seatCount" type="number" min="1" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">제보자 이름 (선택)</label>
              <Input name="reporterName" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">근거 URL (선택)</label>
            <Input name="sourceUrl" type="url" placeholder="https://" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">메모</label>
            <Input name="note" placeholder="문의 일자, 리뉴얼 여부 등" />
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <p className="text-xs text-muted-foreground">단위는 미터(m)입니다.</p>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending || (mode === "new" && !theaterId)}>
            {pending ? "전송 중…" : "제보 제출"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
