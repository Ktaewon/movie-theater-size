"use client";

import Link from "next/link";
import { XIcon } from "lucide-react";
import type { ScreenView } from "@/lib/types";
import { CHAIN_LABEL, TYPE_LABEL } from "@/lib/types";
import { formatArea, formatMeters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function CompareTray({
  selected,
  open,
  onOpenChange,
  onRemove,
  onClear,
}: {
  selected: ScreenView[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>비교 바구니 · {selected.length}/4</SheetTitle>
          <SheetDescription>선택한 상영관의 규격과 면적을 나란히 확인하세요.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {selected.map((s, i) => (
            <div key={s.id} className="relative rounded-xl border bg-card p-3">
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={() => onRemove(s.id)}
                aria-label="제거"
              >
                <XIcon />
              </Button>
              <div className="mb-2 flex items-center gap-2 pr-6">
                <Badge variant="secondary">#{i + 1}</Badge>
                <span className="text-xs text-muted-foreground">
                  {CHAIN_LABEL[s.theater.chain]} · {TYPE_LABEL[s.type]}
                </span>
              </div>
              <Link href={`/screens/${s.id}`} className="block font-medium hover:underline">
                {s.theater.name}
              </Link>
              <p className="text-sm text-muted-foreground">{s.name}</p>
              <p className="mt-2 text-sm tabular-nums">
                {formatMeters(s.measurement?.widthM)} × {formatMeters(s.measurement?.heightM)}
              </p>
              <p className="text-xs text-muted-foreground">{formatArea(s.areaM2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClear}>
            모두 비우기
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
