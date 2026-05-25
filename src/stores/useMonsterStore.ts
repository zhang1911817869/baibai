import { create } from "zustand";
import { Monster } from "@/lib/monsters-data";

interface MonsterStore {
  todayMonster: Monster | null;
  chosenName: string;
  currentAction: string;
  setMonster: (m: Monster) => void;
  setChosenName: (name: string) => void;
  setCurrentAction: (a: string) => void;
  reset: () => void;
}

export const useMonsterStore = create<MonsterStore>((set) => ({
  todayMonster: null,
  chosenName: "",
  currentAction: "",
  setMonster: (m) => set({ todayMonster: m }),
  setChosenName: (name) => set({ chosenName: name }),
  setCurrentAction: (a) => set({ currentAction: a }),
  reset: () => set({ todayMonster: null, chosenName: "", currentAction: "" }),
}));
