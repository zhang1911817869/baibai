"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CoinIcon } from "@/components/game/coin-icon";
import { getBattleRecords, updateBattleRecord, type BattleRecord } from "@/lib/battle-history";
import { BATTLE_STAGES, getSkill, getStage } from "@/lib/game-config";
import { getGameProgress, getTitle, type GameProgress } from "@/lib/game-progress";
import { useMonsterStore } from "@/stores/useMonsterStore";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 7px 5px 8px" as const, boxShadow: "4px 4px 0 #2C2C2C" };
const SKBSM = { border: "1.5px solid #2C2C2C", borderRadius: "3px 5px 4px 6px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

export default function TrophyScreen() {
  const router = useRouter();
  const { lastBattle, beginBattle } = useMonsterStore();
  const [progress, setProgress] = useState<GameProgress | null>(lastBattle?.progress ?? null);
  const [record, setRecord] = useState<BattleRecord | null>(null);
  const [nickname, setNickname] = useState(lastBattle?.monster.title ?? "");
  const [sharing, setSharing] = useState(false);
  const [savedName, setSavedName] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const records = getBattleRecords();
      const active = lastBattle
        ? records.find((item) => item.id === lastBattle.recordId) ?? null
        : records[0] ?? null;
      setRecord(active);
      setProgress(lastBattle?.progress ?? getGameProgress());
      setNickname(active?.monsterNickname ?? lastBattle?.monster.title ?? "");
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [lastBattle]);

  if (!progress || !record) {
    return <div className="min-h-svh flex items-center justify-center bg-[#FAF6EE] text-sm font-bold text-[#8E8677]">战利品正在盖章...</div>;
  }

  const skillName = lastBattle?.awardedSkill
    ? getSkill(lastBattle.awardedSkill).name
    : record.skillAwarded ?? "还没选择技能";
  const finishedStageIndex = lastBattle?.stageIndex ?? Math.max(0, progress.currentMonsterIndex - 1);
  const nextStage = getStage(progress.currentMonsterIndex);
  const completedAll = finishedStageIndex === BATTLE_STAGES.length - 1;
  const nextChallengeTitle = completedAll ? "主线通关，解锁无尽挑战" : "技能到手，下一只更好打。";

  const saveNickname = () => {
    const value = nickname.trim() || record.monsterNickname;
    updateBattleRecord(record.id, { monsterNickname: value });
    setRecord({ ...record, monsterNickname: value });
    setSavedName(true);
  };

  const playNext = () => {
    beginBattle(nextStage.monster, nextStage.index);
    router.push("/strike");
  };

  const shareCard = async () => {
    setSharing(true);
    const text = [
      `我今天打败了：${record.monsterNickname}`,
      `累计点击：${progress.totalClicks} 次`,
      `最高连击：x${progress.maxCombo}`,
      `获得技能：${skillName}`,
      `当前称号：${getTitle(progress)}`,
      "",
      "拜拜小怪｜不是你废，是小怪太吵",
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "拜拜小怪｜战绩卡", text });
      else {
        await navigator.clipboard.writeText(text);
        window.alert("战绩卡文字已复制！");
      }
    } catch {}
    setSharing(false);
  };

  return (
    <div className="min-h-svh bg-[#FAF6EE] px-5 pt-6 pb-12">
      <div className="mx-auto max-w-sm space-y-4">
        <div className="flex justify-between items-center">
          <button className="text-xs font-bold px-3 py-1.5 bg-white" style={SKBSM} onClick={() => router.push("/")}>← 首页</button>
          <motion.span
            className="px-3 py-1 text-xs font-black text-white"
            style={{ ...SKBSM, ...FH, background: "#A1B57D" }}
            initial={{ rotate: -8, scale: 0 }}
            animate={{ rotate: -2, scale: 1 }}
          >
            CLEAR!
          </motion.span>
        </div>

        <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="text-center">
          <h1 className="text-3xl font-black" style={FH}>今日突围成功</h1>
          <p className="text-sm font-bold text-[#E27B66]">{nextChallengeTitle}</p>
        </motion.div>

        <motion.section
          className="bg-white p-4"
          style={{ ...SKB, boxShadow: "7px 7px 0 #2C2C2C", transform: "rotate(1deg)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between text-[10px] font-bold text-[#8E8677] pb-2 border-b border-dashed border-stone-300">
            <span>拜拜小怪 · 战利品卡</span>
            <span className="flex items-center gap-1">
              <CoinIcon className="h-4 w-4" />
              +{lastBattle?.coinsEarned ?? record.coinsEarned ?? 0}
            </span>
          </div>
          <div className="text-center my-4 p-3 bg-[#FFF8E8]" style={SKBSM}>
            <p className="text-3xl">🌟</p>
            <p className="text-[11px] font-bold text-[#8E8677]">我今天打败了</p>
            <h2 className="text-xl font-black text-[#2C2C2C]" style={FH}>{record.monsterNickname}</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="p-2 bg-[#FAF6EE]" style={SKBSM}>累计点击<br /><strong className="text-base">{progress.totalClicks} 次</strong></div>
            <div className="p-2 bg-[#FAF6EE]" style={SKBSM}>最高连击<br /><strong className="text-base">x{progress.maxCombo}</strong></div>
            <div className="p-2 bg-[#FAF6EE]" style={SKBSM}>获得技能<br /><strong>{skillName}</strong></div>
            <div className="p-2 bg-[#FAF6EE]" style={SKBSM}>当前称号<br /><strong>{getTitle(progress)}</strong></div>
          </div>
          <p className="text-center text-xs font-black text-[#E27B66]" style={FH}>不是你废，是小怪太吵</p>
        </motion.section>

        <section className="p-3 bg-white" style={SKB}>
          <p className="text-xs font-black mb-2" style={FH}>给刚才这只小怪起个外号</p>
          <div className="flex gap-2">
            <input
              value={nickname}
              onChange={(event) => { setNickname(event.target.value); setSavedName(false); }}
              className="min-w-0 flex-1 px-3 py-2 bg-[#FAF6EE] text-sm outline-none"
              style={SKBSM}
              placeholder="例如：下周再说大王"
            />
            <button className="px-3 text-xs font-black bg-[#E8AA42]" style={SKBSM} onClick={saveNickname}>
              {savedName ? "已保存" : "保存"}
            </button>
          </div>
        </section>

        {completedAll && (
          <section className="bg-[#FFF1C8] p-3 text-center" style={SKB}>
            <p className="text-[10px] font-bold text-[#E27B66]">无尽挑战已开启</p>
            <h2 className="mt-1 text-lg font-black text-[#2C2C2C]" style={FH}>浆糊王返场赛</h2>
            <p className="mt-1 text-xs font-bold text-[#5F594F]">挑战更高连击，继续赚金币和新技能。</p>
          </section>
        )}

        <button className="w-full py-3.5 text-base font-black bg-[#E8AA42]" style={{ ...SKB, ...FH }} onClick={playNext}>
          {completedAll ? "进入无尽挑战 · 刷新连击 🥊" : `下一关：${nextStage.monster.title} →`}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="py-3 font-bold text-sm bg-white" style={SKB} onClick={shareCard}>{sharing ? "分享中..." : "分享战绩卡"}</button>
          <button className="py-3 font-bold text-sm bg-white" style={SKB} onClick={() => router.push("/history")}>查看排行榜</button>
        </div>
      </div>
    </div>
  );
}
