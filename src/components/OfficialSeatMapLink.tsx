import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OfficialSeatMapLink({
  href,
  compact = false,
}: {
  href: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground hover:underline"
      >
        좌석배치도
        <ExternalLinkIcon className="size-3" />
      </a>
    );
  }

  return (
    <Button asChild variant="outline">
      <a href={href} target="_blank" rel="noopener noreferrer">
        공식 좌석배치도
        <ExternalLinkIcon />
      </a>
    </Button>
  );
}
