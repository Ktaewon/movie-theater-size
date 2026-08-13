import type { Confidence, SourceType } from "./types";

export function areaM2(width: number | null | undefined, height: number | null | undefined): number | null {
  if (width == null || height == null || width <= 0 || height <= 0) return null;
  return Math.round(width * height * 10) / 10;
}

export function aspectRatio(width: number | null | undefined, height: number | null | undefined): number | null {
  if (width == null || height == null || height <= 0) return null;
  return Math.round((width / height) * 100) / 100;
}

export function formatMeters(value: number | null | undefined, digits = 1): string {
  if (value == null) return "—";
  return `${value.toFixed(digits)} m`;
}

export function formatArea(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(1)} ㎡`;
}

export function formatAspect(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(2)}:1`;
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

export function confidenceFromSource(source: SourceType): Confidence {
  switch (source) {
    case "official":
    case "press":
      return "high";
    case "wiki":
      return "high";
    case "community":
      return "medium";
    case "user_report":
      return "medium";
    case "estimate":
    case "seat_estimate":
      return "low";
    default:
      return "unknown";
  }
}

export function isSeatEstimate(source?: SourceType | null): boolean {
  return source === "seat_estimate";
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
