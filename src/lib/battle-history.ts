export interface BattleRecord {
  id: number;
  monsterNickname: string;
  actionTaken: string;
  stars: number;
  createdAt: string;
}

export interface BattleSummary {
  monsterNickname: string;
  total: number;
  lastAt: string;
}

const STORAGE_KEY = "baibai:battle-history";
const MAX_RECORDS = 100;

function isBattleRecord(value: unknown): value is BattleRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<BattleRecord>;
  return (
    typeof record.id === "number" &&
    typeof record.monsterNickname === "string" &&
    typeof record.actionTaken === "string" &&
    typeof record.stars === "number" &&
    typeof record.createdAt === "string"
  );
}

export function getBattleRecords(): BattleRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isBattleRecord) : [];
  } catch {
    return [];
  }
}

export function saveBattleRecord(
  data: Pick<BattleRecord, "monsterNickname" | "actionTaken">,
): void {
  const record: BattleRecord = {
    ...data,
    id: Date.now(),
    stars: 1,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([record, ...getBattleRecords()].slice(0, MAX_RECORDS)),
  );
}

export function getBattleSummary(records: BattleRecord[]): BattleSummary[] {
  const summaries = new Map<string, BattleSummary>();

  for (const record of records) {
    const existing = summaries.get(record.monsterNickname);
    if (existing) {
      existing.total += 1;
      continue;
    }

    summaries.set(record.monsterNickname, {
      monsterNickname: record.monsterNickname,
      total: 1,
      lastAt: record.createdAt,
    });
  }

  return Array.from(summaries.values()).sort((a, b) => b.total - a.total);
}
