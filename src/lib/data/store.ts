import { promises as fs } from "fs";
import path from "path";
import { SEED_MEASUREMENTS, SCREENS } from "./seed-screens";
import { THEATERS } from "./seed-theaters";
import { areaM2, aspectRatio, confidenceFromSource, uid } from "../format";
import type {
  MeasurementStatus,
  ReportInput,
  ScreenFilters,
  ScreenMeasurement,
  ScreenType,
  ScreenView,
  SortDir,
  SortKey,
} from "../types";

/** Local: ./data · Vercel serverless: /tmp (ephemeral) · always keep in-memory fallback */
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "movie-theater-size")
  : path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "runtime-store.json");

interface RuntimeStore {
  measurements: ScreenMeasurement[];
  /** Extra screens created via reports (optional) */
  extraScreens: typeof SCREENS;
}

let memoryStore: RuntimeStore | null = null;

function freshStore(): RuntimeStore {
  return {
    measurements: [...SEED_MEASUREMENTS],
    extraScreens: [],
  };
}

function mergeSeed(parsed: RuntimeStore): { store: RuntimeStore; changed: boolean } {
  const byId = new Map(parsed.measurements.map((m) => [m.id, m]));
  let changed = false;
  for (const seed of SEED_MEASUREMENTS) {
    const existing = byId.get(seed.id);
    if (!existing) {
      parsed.measurements.push(seed);
      changed = true;
      continue;
    }
    if (existing.source === "user_report" || existing.status === "pending") continue;
    const before = JSON.stringify(existing);
    Object.assign(existing, seed);
    if (JSON.stringify(existing) !== before) changed = true;
  }
  const seedIds = new Set(SEED_MEASUREMENTS.map((m) => m.id));
  const beforeLen = parsed.measurements.length;
  parsed.measurements = parsed.measurements.filter(
    (m) => seedIds.has(m.id) || m.source === "user_report" || m.status === "pending",
  );
  if (parsed.measurements.length !== beforeLen) changed = true;
  parsed.extraScreens = parsed.extraScreens ?? [];
  return { store: parsed, changed };
}

async function ensureStore(): Promise<RuntimeStore> {
  if (memoryStore) {
    const { store, changed } = mergeSeed(memoryStore);
    memoryStore = store;
    if (changed) await saveStore(store);
    return store;
  }

  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as RuntimeStore;
    if (!parsed.measurements?.length) {
      const seeded = freshStore();
      seeded.extraScreens = parsed.extraScreens ?? [];
      memoryStore = seeded;
      await saveStore(seeded);
      return seeded;
    }
    const { store, changed } = mergeSeed(parsed);
    memoryStore = store;
    if (changed) await saveStore(store);
    return store;
  } catch {
    const initial = freshStore();
    memoryStore = initial;
    await saveStore(initial);
    return initial;
  }
}

async function saveStore(store: RuntimeStore): Promise<void> {
  memoryStore = store;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Serverless read-only / tmp full — keep memory store only
  }
}

function allScreens(store: RuntimeStore) {
  return [...SCREENS, ...store.extraScreens];
}

function approvedForScreen(store: RuntimeStore, screenId: string): ScreenMeasurement | null {
  const list = store.measurements
    .filter((m) => m.screenId === screenId && m.status === "approved")
    .sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt) || b.createdAt.localeCompare(a.createdAt));
  return list[0] ?? null;
}

function toView(store: RuntimeStore, screen: (typeof SCREENS)[number]): ScreenView | null {
  const theater = THEATERS.find((t) => t.id === screen.theaterId);
  if (!theater) return null;
  const measurement = approvedForScreen(store, screen.id);
  // Public catalog: only screens with approved width×height and a cited source.
  if (
    !measurement ||
    measurement.widthM == null ||
    measurement.heightM == null ||
    !measurement.source ||
    measurement.source === "estimate" ||
    !measurement.sourceLabel
  ) {
    return null;
  }
  const width = measurement.widthM;
  const height = measurement.heightM;
  return {
    ...screen,
    seatCount: measurement.seatCount ?? screen.seatCount ?? null,
    theater,
    measurement,
    areaM2: areaM2(width, height),
    aspectRatio: aspectRatio(width, height),
  };
}

export async function listScreenViews(filters: ScreenFilters = {}): Promise<ScreenView[]> {
  const store = await ensureStore();
  let views = allScreens(store)
    .map((s) => toView(store, s))
    .filter((v): v is ScreenView => v != null);

  const q = filters.q?.trim().toLowerCase();
  if (q) {
    views = views.filter(
      (v) =>
        v.theater.name.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.theater.city.toLowerCase().includes(q) ||
        v.theater.region.includes(q),
    );
  }
  if (filters.chain && filters.chain !== "all") {
    views = views.filter((v) => v.theater.chain === filters.chain);
  }
  if (filters.region && filters.region !== "all") {
    views = views.filter((v) => v.theater.region === filters.region);
  }
  if (filters.type && filters.type !== "all") {
    views = views.filter((v) => v.type === filters.type);
  }
  if (filters.hasSize) {
    views = views.filter((v) => v.areaM2 != null);
  }

  const sort: SortKey = filters.sort ?? "area";
  const dir: SortDir = filters.dir ?? "desc";
  const mul = dir === "asc" ? 1 : -1;

  views.sort((a, b) => {
    const av = sortValue(a, sort);
    const bv = sortValue(b, sort);
    if (av == null && bv == null) return a.theater.name.localeCompare(b.theater.name, "ko");
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "string" && typeof bv === "string") {
      return mul * av.localeCompare(bv, "ko");
    }
    return mul * (Number(av) - Number(bv));
  });

  return views;
}

function sortValue(v: ScreenView, sort: SortKey): number | string | null {
  switch (sort) {
    case "area":
      return v.areaM2;
    case "width":
      return v.measurement?.widthM ?? null;
    case "height":
      return v.measurement?.heightM ?? null;
    case "seats":
      return v.seatCount ?? null;
    case "name":
      return `${v.theater.name} ${v.name}`;
  }
}

export async function getScreenView(id: string): Promise<ScreenView | null> {
  const store = await ensureStore();
  const screen = allScreens(store).find((s) => s.id === id);
  if (!screen) return null;
  return toView(store, screen);
}

export async function getTheater(id: string) {
  return THEATERS.find((t) => t.id === id) ?? null;
}

export async function listTheaters() {
  return THEATERS;
}

export async function listMeasurements(status?: MeasurementStatus): Promise<ScreenMeasurement[]> {
  const store = await ensureStore();
  const list = status ? store.measurements.filter((m) => m.status === status) : store.measurements;
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listHistory(screenId: string): Promise<ScreenMeasurement[]> {
  const store = await ensureStore();
  return store.measurements
    .filter((m) => m.screenId === screenId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function submitReport(input: ReportInput): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (input.website) {
    return { ok: true, id: "ignored" }; // honeypot
  }
  if (!input.widthM || !input.heightM || input.widthM <= 0 || input.heightM <= 0) {
    return { ok: false, error: "가로·세로 크기를 올바르게 입력해 주세요." };
  }
  if (input.widthM > 100 || input.heightM > 100) {
    return { ok: false, error: "크기는 미터(m) 단위로 입력해 주세요. (예: 31)" };
  }

  const store = await ensureStore();
  let screenId = input.screenId;

  if (!screenId) {
    if (!input.theaterId || !input.newScreenName) {
      return { ok: false, error: "상영관 또는 신규 상영관 정보가 필요합니다." };
    }
    const theater = THEATERS.find((t) => t.id === input.theaterId);
    if (!theater) return { ok: false, error: "영화관을 찾을 수 없습니다." };
    const newId = uid("screen");
    const type: ScreenType = input.newScreenType ?? "standard";
    store.extraScreens.push({
      id: newId,
      theaterId: theater.id,
      name: input.newScreenName,
      type,
      seatCount: input.seatCount ?? null,
    });
    screenId = newId;
  } else {
    const exists = allScreens(store).some((s) => s.id === screenId);
    if (!exists) return { ok: false, error: "상영관을 찾을 수 없습니다." };
  }

  const now = new Date().toISOString();
  const measurement: ScreenMeasurement = {
    id: uid("report"),
    screenId,
    widthM: input.widthM,
    heightM: input.heightM,
    widthScopeM: input.widthScopeM ?? null,
    heightScopeM: input.heightScopeM ?? null,
    seatCount: input.seatCount ?? null,
    source: "user_report",
    sourceLabel: input.reporterName ? `사용자 제보 (${input.reporterName})` : "사용자 제보",
    sourceUrl: input.sourceUrl,
    confidence: confidenceFromSource("user_report"),
    verifiedAt: now,
    status: "pending",
    note: input.note,
    reporterName: input.reporterName,
    createdAt: now,
  };

  store.measurements.push(measurement);
  await saveStore(store);
  return { ok: true, id: measurement.id };
}

export async function reviewMeasurement(
  id: string,
  status: "approved" | "rejected",
  reviewNote?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const store = await ensureStore();
  const item = store.measurements.find((m) => m.id === id);
  if (!item) return { ok: false, error: "제보를 찾을 수 없습니다." };
  if (item.status !== "pending") return { ok: false, error: "이미 처리된 제보입니다." };

  item.status = status;
  item.reviewedAt = new Date().toISOString();
  item.reviewNote = reviewNote;
  if (status === "approved") {
    item.verifiedAt = item.reviewedAt;
    item.confidence = confidenceFromSource("user_report");
  }
  await saveStore(store);
  return { ok: true };
}

export async function getStats() {
  const views = await listScreenViews({});
  const withSize = views.filter((v) => v.areaM2 != null);
  const pending = await listMeasurements("pending");
  return {
    theaters: THEATERS.length,
    screens: views.length,
    withSize: withSize.length,
    pendingReports: pending.length,
  };
}
