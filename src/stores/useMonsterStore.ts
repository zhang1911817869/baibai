import { create } from "zustand";
import type { GameProgress } from "@/lib/game-progress";
import type { SkillId } from "@/lib/game-config";
import type { Monster } from "@/lib/monsters-data";

export interface BattleResult {
  recordId: number;
  monster: Monster;
  stageIndex: number;
  clicks: number;
  maxCombo: number;
  coinsEarned: number;
  progress: GameProgress;
  awardedSkill: SkillId | null;
}

interface MonsterStore {
  todayMonster: Monster | null;
  battleStageIndex: number;
  chosenName: string;
  currentAction: string;
  lastBattle: BattleResult | null;
  setMonster: (m: Monster) => void;
  beginBattle: (m: Monster, stageIndex: number) => void;
  setChosenName: (name: string) => void;
  setCurrentAction: (a: string) => void;
  setLastBattle: (result: BattleResult) => void;
  setAwardedSkill: (skill: SkillId, progress: GameProgress) => void;
  reset: () => void;
}

export const useMonsterStore = create<MonsterStore>((set) => ({
  todayMonster: null,
  battleStageIndex: 0,
  chosenName: "",
  currentAction: "",
  lastBattle: null,
  setMonster: (m) => set({ todayMonster: m }),
  beginBattle: (m, stageIndex) => set({
    todayMonster: m,
    battleStageIndex: stageIndex,
    chosenName: "",
    currentAction: "",
    lastBattle: null,
  }),
  setChosenName: (name) => set({ chosenName: name }),
  setCurrentAction: (a) => set({ currentAction: a }),
  setLastBattle: (result) => set({ lastBattle: result }),
  setAwardedSkill: (skill, progress) => set((state) => ({
    lastBattle: state.lastBattle
      ? { ...state.lastBattle, awardedSkill: skill, progress }
      : null,
  })),
  reset: () => set({ todayMonster: null, battleStageIndex: 0, chosenName: "", currentAction: "", lastBattle: null }),
}));
