export type Chain = "cgv" | "lotte" | "megabox";

export type ScreenType =
  | "standard"
  | "imax"
  | "dolby"
  | "screenx"
  | "4dx"
  | "mx"
  | "superplex"
  | "suite"
  | "premium";

export type SourceType =
  | "official"
  | "press"
  | "community"
  | "user_report"
  | "estimate"
  | "wiki";

export type Confidence = "high" | "medium" | "low" | "unknown";

export type MeasurementStatus = "pending" | "approved" | "rejected";

export type Region =
  | "서울"
  | "경기"
  | "인천"
  | "부산"
  | "대구"
  | "광주"
  | "대전"
  | "울산"
  | "세종"
  | "강원"
  | "충북"
  | "충남"
  | "전북"
  | "전남"
  | "경북"
  | "경남"
  | "제주";

export interface Theater {
  id: string;
  chain: Chain;
  name: string;
  region: Region;
  city: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface ScreenMeasurement {
  id: string;
  screenId: string;
  widthM: number | null;
  heightM: number | null;
  widthScopeM?: number | null;
  heightScopeM?: number | null;
  seatCount?: number | null;
  source: SourceType;
  sourceLabel: string;
  sourceUrl?: string;
  confidence: Confidence;
  verifiedAt: string;
  status: MeasurementStatus;
  note?: string;
  reporterName?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface Screen {
  id: string;
  theaterId: string;
  name: string;
  hallNumber?: string;
  type: ScreenType;
  seatCount?: number | null;
  /** Current approved measurement ids resolved at runtime */
  notes?: string;
}

export interface ScreenView extends Screen {
  theater: Theater;
  measurement: ScreenMeasurement | null;
  areaM2: number | null;
  aspectRatio: number | null;
}

export interface ReportInput {
  screenId?: string;
  theaterId?: string;
  newScreenName?: string;
  newScreenType?: ScreenType;
  widthM: number;
  heightM: number;
  widthScopeM?: number;
  heightScopeM?: number;
  seatCount?: number;
  sourceUrl?: string;
  note?: string;
  reporterName?: string;
  website?: string; // honeypot
}

export type SortKey = "area" | "width" | "height" | "seats" | "name";
export type SortDir = "asc" | "desc";

export interface ScreenFilters {
  q?: string;
  chain?: Chain | "all";
  region?: Region | "all";
  type?: ScreenType | "all";
  hasSize?: boolean;
  sort?: SortKey;
  dir?: SortDir;
}

export const CHAIN_LABEL: Record<Chain, string> = {
  cgv: "CGV",
  lotte: "롯데시네마",
  megabox: "메가박스",
};

export const TYPE_LABEL: Record<ScreenType, string> = {
  standard: "일반",
  imax: "IMAX",
  dolby: "Dolby Cinema",
  screenx: "ScreenX",
  "4dx": "4DX",
  mx: "MX",
  superplex: "슈퍼플렉스",
  suite: "스위트/프리미엄",
  premium: "프리미엄",
};

export const SOURCE_LABEL: Record<SourceType, string> = {
  official: "공식",
  press: "보도자료",
  community: "커뮤니티",
  user_report: "사용자 제보",
  estimate: "추정",
  wiki: "위키",
};

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
  unknown: "미확인",
};

export const REGIONS: Region[] = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];
