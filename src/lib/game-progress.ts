import { BATTLE_STAGES, type ShopItem, type SkillId } from "@/lib/game-config";

export interface GameProgress {
  hasPlayedBefore: boolean;
  title: string;
  totalClicks: number;
  todayClicks: number;
  defeatedMonsters: number;
  maxCombo: number;
  ownedSkills: SkillId[];
  currentMonsterIndex: number;
  coins: number;
  purchasedItems: string[];
  todayKey: string;
  dailyFirstDefeatKey: string | null;
}

const STORAGE_KEY = "baibai:game-progress";
const DAILY_FIRST_DEFEAT_BONUS = 25;

function todayKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function freshProgress(): GameProgress {
  return {
    hasPlayedBefore: false,
    title: "初级突围者",
    totalClicks: 0,
    todayClicks: 0,
    defeatedMonsters: 0,
    maxCombo: 0,
    ownedSkills: [],
    currentMonsterIndex: 0,
    coins: 0,
    purchasedItems: [],
    todayKey: todayKey(),
    dailyFirstDefeatKey: null,
  };
}

function persist(progress: GameProgress): GameProgress {
  const updated = { ...progress, title: deriveTitle(progress) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getGameProgress(): GameProgress {
  if (typeof window === "undefined") return freshProgress();

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<GameProgress>;
    const current = { ...freshProgress(), ...stored };
    if (current.currentMonsterIndex === 2 && current.defeatedMonsters >= 3) {
      current.currentMonsterIndex = 3;
    }
    current.hasPlayedBefore = stored.hasPlayedBefore ?? Boolean(
      current.totalClicks ||
      current.defeatedMonsters ||
      current.ownedSkills.length ||
      current.currentMonsterIndex ||
      current.coins,
    );
    current.title = deriveTitle(current);
    if (current.todayKey !== todayKey()) {
      current.todayKey = todayKey();
      current.todayClicks = 0;
    }
    const normalized = JSON.stringify(current);
    if (localStorage.getItem(STORAGE_KEY) !== normalized) {
      localStorage.setItem(STORAGE_KEY, normalized);
    }
    return current;
  } catch {
    return freshProgress();
  }
}

export function recordClick(combo: number): GameProgress {
  const progress = getGameProgress();
  return persist({
    ...progress,
    hasPlayedBefore: true,
    totalClicks: progress.totalClicks + 1,
    todayClicks: progress.todayClicks + 1,
    maxCombo: Math.max(progress.maxCombo, combo),
  });
}

export function getSkillLevel(progress: GameProgress, skillId: SkillId): number {
  return progress.ownedSkills.filter((owned) => owned === skillId).length;
}

export function rewardDefeat(stageIndex: number, battleMaxCombo: number): {
  progress: GameProgress;
  earnedCoins: number;
} {
  const progress = getGameProgress();
  const stage = BATTLE_STAGES[stageIndex];
  const comboBonus = Math.floor(battleMaxCombo / 5) * 2;
  const firstTodayBonus = progress.dailyFirstDefeatKey === todayKey() ? 0 : DAILY_FIRST_DEFEAT_BONUS;
  const earnedCoins = stage.rewardCoins + comboBonus + firstTodayBonus;
  const nextIndex = Math.max(
    progress.currentMonsterIndex,
    Math.min(stageIndex + 1, BATTLE_STAGES.length - 1),
  );
  const updated = persist({
    ...progress,
    hasPlayedBefore: true,
    defeatedMonsters: progress.defeatedMonsters + 1,
    currentMonsterIndex: nextIndex,
    coins: progress.coins + earnedCoins,
    dailyFirstDefeatKey: todayKey(),
  });

  return { progress: updated, earnedCoins };
}

export function getRewardPreview(progress: GameProgress, stageIndex: number): {
  baseCoins: number;
  dailyFirstDefeatBonus: number;
} {
  return {
    baseCoins: BATTLE_STAGES[stageIndex].rewardCoins,
    dailyFirstDefeatBonus: progress.dailyFirstDefeatKey === todayKey() ? 0 : DAILY_FIRST_DEFEAT_BONUS,
  };
}

export function acquireSkill(skillId: SkillId): GameProgress {
  const progress = getGameProgress();
  return persist({ ...progress, ownedSkills: [...progress.ownedSkills, skillId] });
}

export function purchaseItem(item: ShopItem): { ok: boolean; progress: GameProgress } {
  const progress = getGameProgress();
  if (progress.coins < item.cost) return { ok: false, progress };

  const ownedSkills = item.skillId
    ? [...progress.ownedSkills, item.skillId]
    : progress.ownedSkills;
  const purchasedItems = item.skillId
    ? progress.purchasedItems
    : [...new Set([...progress.purchasedItems, item.id])];

  return {
    ok: true,
    progress: persist({
      ...progress,
      coins: progress.coins - item.cost,
      ownedSkills,
      purchasedItems,
    }),
  };
}

function deriveTitle(progress: GameProgress): string {
  if (progress.purchasedItems.includes("title-brave")) return "噪音终结者";
  if (progress.defeatedMonsters >= 5) return "打怪熟练工";
  if (progress.defeatedMonsters >= 1) return "小怪驱逐员";
  return "初级突围者";
}

export function getTitle(progress: GameProgress): string {
  return progress.title || deriveTitle(progress);
}
