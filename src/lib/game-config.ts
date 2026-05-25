import { MONSTERS, type Monster } from "@/lib/monsters-data";

export type SkillId = "combo" | "critical" | "auto" | "bomb";

export interface BattleStage {
  index: number;
  monster: Monster;
  maxHp: number;
  rewardCoins: number;
  taunt: string;
  weakness: string;
}

export interface SkillDefinition {
  id: SkillId;
  name: string;
  icon: string;
  description: string;
}

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  skillId?: SkillId;
}

const findMonster = (id: string): Monster => {
  const monster = MONSTERS.find((item) => item.id === id);
  if (!monster) throw new Error(`Monster "${id}" is missing.`);
  return monster;
};

export const BATTLE_STAGES: BattleStage[] = [
  {
    index: 0,
    monster: findMonster("procrastinate"),
    maxHp: 20,
    rewardCoins: 20,
    taunt: "只要你不开始，我就永远不会输。",
    weakness: "怕你开始行动",
  },
  {
    index: 1,
    monster: findMonster("stress"),
    maxHp: 100,
    rewardCoins: 55,
    taunt: "待办清单已经在我手里爆炸啦！",
    weakness: "怕连续点击",
  },
  {
    index: 2,
    monster: { ...findMonster("brain_fog"), title: "脑雾浆糊王", nickname: "浆糊大王" },
    maxHp: 500,
    rewardCoins: 140,
    taunt: "你看得见我，但你绝对想不清楚。",
    weakness: "怕暴击贴纸",
  },
  {
    index: 3,
    monster: findMonster("overload"),
    maxHp: 680,
    rewardCoins: 180,
    taunt: "消息再响一下，你就忘了刚才要干嘛。",
    weakness: "怕自动拍打器",
  },
  {
    index: 4,
    monster: findMonster("social"),
    maxHp: 880,
    rewardCoins: 230,
    taunt: "你不回消息，我就替你尴尬三天。",
    weakness: "怕坏念头炸弹",
  },
  {
    index: 5,
    monster: findMonster("low_energy"),
    maxHp: 1200,
    rewardCoins: 300,
    taunt: "你都没电了，还想打赢我吗？",
    weakness: "怕技能全开",
  },
];

export const SKILLS: SkillDefinition[] = [
  {
    id: "combo",
    name: "连击小拳头",
    icon: "🥊",
    description: "快速连点会叠加伤害，越打越上头。",
  },
  {
    id: "critical",
    name: "暴击贴纸",
    icon: "💥",
    description: "点击有概率造成 3 倍伤害，并弹出暴击贴纸。",
  },
  {
    id: "auto",
    name: "自动拍打器",
    icon: "🖐️",
    description: "每秒自动拍一下，专治厚血小怪。",
  },
  {
    id: "bomb",
    name: "坏念头炸弹",
    icon: "💣",
    description: "每场可戳破 3 个坏念头，一次扣除 30% 血量。",
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: "shop-critical", name: "暴击贴纸", icon: "💥", cost: 45, description: "暴击技能 +1 级", skillId: "critical" },
  { id: "shop-bomb", name: "坏念头炸弹", icon: "💣", cost: 60, description: "炸弹技能 +1 级", skillId: "bomb" },
  { id: "shop-auto", name: "自动拍打器", icon: "🖐️", cost: 80, description: "自动攻击 +1 级", skillId: "auto" },
  { id: "mint-skin", name: "薄荷小怪皮肤", icon: "🎨", cost: 70, description: "收藏一套薄荷配色" },
  { id: "spark-hit", name: "闪光打击特效", icon: "✨", cost: 90, description: "收藏漫画闪光特效" },
  { id: "title-brave", name: "噪音终结者称号", icon: "🏷️", cost: 120, description: "解锁展示称号" },
];

export function getStage(index: number): BattleStage {
  return BATTLE_STAGES[Math.min(Math.max(index, 0), BATTLE_STAGES.length - 1)];
}

export function getSkill(id: SkillId): SkillDefinition {
  return SKILLS.find((skill) => skill.id === id) ?? SKILLS[0];
}

export function getSkillChoices(stageIndex: number): SkillDefinition[] {
  const start = stageIndex % SKILLS.length;
  return Array.from({ length: 3 }, (_, offset) => SKILLS[(start + offset) % SKILLS.length]);
}
