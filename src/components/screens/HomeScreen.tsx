"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CoinIcon } from "@/components/game/coin-icon";
import { MonsterAvatar } from "@/components/game/monster-avatar";
import { BATTLE_STAGES, getStage } from "@/lib/game-config";
import { getGameProgress, getRewardPreview, getTitle, type GameProgress } from "@/lib/game-progress";
import { useMonsterStore } from "@/stores/useMonsterStore";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const SMALL_BORDER = { border: "1.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

export default function HomeScreen() {
  const router = useRouter();
  const beginBattle = useMonsterStore((state) => state.beginBattle);
  const [progress, setProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setProgress(getGameProgress()), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const isNewUser = !progress?.hasPlayedBefore;
  const stage = getStage(isNewUser ? 0 : progress?.currentMonsterIndex ?? 0);
  const isBossRematch = !isNewUser && stage.index === BATTLE_STAGES.length - 1 && (progress?.defeatedMonsters ?? 0) >= BATTLE_STAGES.length;
  const stageLabel = isNewUser
    ? `新手关 · 第 1 / ${BATTLE_STAGES.length} 只`
    : isBossRematch
      ? "无尽挑战 · 浆糊王返场"
      : `主线挑战 · 第 ${stage.index + 1} / ${BATTLE_STAGES.length} 只`;
  const intro = isNewUser ? "今天来捣乱的是：" : "今天来烦你的，是这只";
  const rewardText = isNewUser ? "首次击败：技能 3 选 1" : isBossRematch ? "刷新连击，继续选择新技能" : "通关可选新技能";
  const actionText = isNewUser ? "开始打怪" : isBossRematch ? "挑战更高连击" : "继续挑战";
  const goalText = isBossRematch ? "今日目标：刷新连击" : "今日目标：击败 1 只";
  const reward = progress ? getRewardPreview(progress, stage.index) : { baseCoins: stage.rewardCoins, dailyFirstDefeatBonus: 25 };
  const weakPointText = isNewUser ? "前 5 连点就会打更痛" : stage.weakness;

  const startBattle = () => {
    beginBattle(stage.monster, stage.index);
    router.push("/strike");
  };

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#FAF6EE] px-4 pb-[5.75rem] pt-[max(0.7rem,env(safe-area-inset-top))] sm:px-5 sm:pt-5">
      <div className="mx-auto max-w-[22rem] space-y-2.5 sm:space-y-3">
        <header className="text-center">
          <h1 className="text-[2rem] leading-none font-black text-[#2C2C2C] sm:text-4xl" style={FH}>拜拜小怪</h1>
          <p className="mt-1 text-[12px] font-semibold text-[#5F594F] sm:text-sm">不是你有问题，是小怪来捣乱了。</p>
        </header>

        <div className="flex items-center justify-between bg-[#F5F0E5] px-3 py-1.5 text-[#5F594F]" style={SMALL_BORDER}>
          <div>
            <p className="text-[10px] text-[#8E8677] font-bold">当前称号</p>
            <p className="text-[13px] font-black" style={FH}>{progress ? getTitle(progress) : "初级突围者"}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#8E8677] font-bold">金币</p>
            <p className="flex items-center justify-end gap-1 text-sm font-black text-[#C88728]">
              <CoinIcon className="h-4 w-4" />
              {progress?.coins ?? 0}
            </p>
          </div>
        </div>

        <motion.section
          className="bg-white px-3 pb-3 pt-2.5 text-center sm:px-4"
          style={{ ...SKB, boxShadow: "5px 5px 0 #2C2C2C" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-bold">
            <p className="text-[#E27B66]">{stageLabel}</p>
            <p className="rounded-full bg-[#FFF0D0] px-2 py-0.5 text-[#9B6418]">{goalText}</p>
          </div>
          <p className="text-[10px] font-bold text-[#8E8677]">{intro}</p>
          <MonsterAvatar
            monsterId={stage.monster.id}
            size={126}
            className="mx-auto h-[clamp(6.25rem,16svh,7.875rem)] w-[clamp(6.25rem,16svh,7.875rem)]"
            interactive
          />
          <h2 className="-mt-1 text-xl font-black text-[#2C2C2C]" style={FH}>{stage.monster.title}</h2>
          <p className="mt-0.5 text-[11px] leading-4 text-[#8E8677]">“{stage.taunt}”</p>
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-[11px] font-black text-[#5F594F] sm:text-xs">
              <span>HP</span>
              <span>{stage.maxHp} / {stage.maxHp}</span>
            </div>
            <div className="hp-bar">
              <motion.div
                className="hp-fill w-full origin-left"
                animate={{ scaleX: [0.98, 1, 0.99, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-left text-[10px] font-bold">
            <p className="rounded-md bg-[#FFF8E8] px-2 py-1.5 text-[#A66B20]">
              弱点：{weakPointText}
            </p>
            <p className="flex items-center gap-1 rounded-md bg-[#FFF8E8] px-2 py-1.5 text-[#A66B20]">
              <CoinIcon className="h-3.5 w-3.5 shrink-0" />
              基础奖励：+{reward.baseCoins} 起
            </p>
          </div>
          <p className="mt-1.5 text-[10px] font-bold text-[#E27B66]">
            连击可加金币 · {reward.dailyFirstDefeatBonus > 0 ? `今日首胜 +${reward.dailyFirstDefeatBonus} · ` : ""}{rewardText}
          </p>
          <motion.button
            className="mt-2 w-full py-3 text-xl font-black text-[#2C2C2C] sm:py-3.5"
            style={{ ...SKB, ...FH, background: "#E8AA42", boxShadow: "4px 4px 0 #2C2C2C" }}
            animate={{ scale: [1, 1.012, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileTap={{ scale: 0.96 }}
            onClick={startBattle}
          >
            🥊 {actionText}
          </motion.button>
          <p className="mt-1.5 text-[10px] font-semibold text-[#8E8677]">{isNewUser ? "点一下就开打，打完就能选技能" : "点一下立即开打，技能马上生效"}</p>
        </motion.section>
      </div>
    </div>
  );
}
