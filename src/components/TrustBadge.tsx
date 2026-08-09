import { Badge } from "@/components/ui/badge";
import type { Confidence, SourceType } from "@/lib/types";
import { CONFIDENCE_LABEL, SOURCE_LABEL } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function TrustBadge({
  source,
  confidence,
  verifiedAt,
  sourceLabel,
  compact = false,
}: {
  source?: SourceType;
  confidence?: Confidence;
  verifiedAt?: string;
  sourceLabel?: string;
  compact?: boolean;
}) {
  if (!source || !confidence) {
    return (
      <Badge variant="outline" className="font-normal text-muted-foreground">
        크기 미확인
      </Badge>
    );
  }

  const tone =
    confidence === "high"
      ? "default"
      : confidence === "medium"
        ? "secondary"
        : "outline";

  if (compact) {
    return (
      <Badge variant={tone} className="font-normal">
        {CONFIDENCE_LABEL[confidence]} · {formatDate(verifiedAt)}
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={tone}>신뢰도 {CONFIDENCE_LABEL[confidence]}</Badge>
      <span className="text-xs text-muted-foreground">
        {sourceLabel ?? SOURCE_LABEL[source]} · {formatDate(verifiedAt)}
      </span>
    </div>
  );
}
