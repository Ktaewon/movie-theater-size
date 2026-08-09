"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ScreenMeasurement } from "@/lib/types";
import { formatDate, formatMeters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminPanel() {
  const [key, setKey] = useState("dev-admin");
  const [reports, setReports] = useState<ScreenMeasurement[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/reports?status=pending", {
      headers: { "x-admin-key": key },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error || "불러오기 실패");
      return;
    }
    setReports(data.reports);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function review(id: string, status: "approved" | "rejected") {
    const res = await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "처리 실패");
      return;
    }
    toast.success(status === "approved" ? "승인되었습니다" : "거절되었습니다");
    await load();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">관리자 인증</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 space-y-1.5">
            <label className="text-xs text-muted-foreground">관리자 키</label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          <Button type="button" onClick={() => void load()} disabled={loading}>
            {loading ? "로딩…" : "대기 제보 새로고침"}
          </Button>
        </CardContent>
      </Card>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            대기 중인 제보가 없습니다.
          </CardContent>
        </Card>
      ) : (
        reports.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{r.screenId}</p>
                  <Badge variant="secondary">pending</Badge>
                </div>
                <p className="text-sm tabular-nums">
                  {formatMeters(r.widthM)} × {formatMeters(r.heightM)}
                  {r.widthScopeM
                    ? ` · SCOPE ${formatMeters(r.widthScopeM)} × ${formatMeters(r.heightScopeM)}`
                    : ""}
                  {r.seatCount ? ` · ${r.seatCount}석` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.sourceLabel} · {formatDate(r.createdAt)}
                  {r.reporterName ? ` · ${r.reporterName}` : ""}
                </p>
                {r.note ? <p className="text-sm">{r.note}</p> : null}
                {r.sourceUrl ? (
                  <Button asChild variant="link" className="h-auto px-0 text-xs">
                    <a href={r.sourceUrl} target="_blank" rel="noreferrer">
                      근거 링크
                    </a>
                  </Button>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={() => void review(r.id, "approved")}>
                  승인
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void review(r.id, "rejected")}
                >
                  거절
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
