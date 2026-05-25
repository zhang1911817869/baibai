"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { CoinIcon } from "@/components/game/coin-icon";
import { MonsterAvatar } from "@/components/game/monster-avatar";
import { SkillChoicePanel } from "@/components/game/skill-choice-panel";
import { saveBattleRecord, updateBattleRecord } from "@/lib/battle-history";
import { BATTLE_STAGES, getSkillChoices, getStage, type SkillDefinition } from "@/lib/game-config";
import {
  acquireSkill,
  getGameProgress,
  getSkillLevel,
  recordClick,
  rewardDefeat,
  type GameProgress,
} from "@/lib/game-progress";
import { useMonsterStore } from "@/stores/useMonsterStore";

interface HitEffect {
  id: number;
  damage: number;
  label: string;
  left: number;
}

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 7px 5px 8px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

export default function StrikeScreen() {
  const router = useRouter();
  const { todayMonster, battleStageIndex, beginBattle, setLastBattle, setAwardedSkill } = useMonsterStore();
  const stage = getStage(battleStageIndex);
  const monster = todayMonster ?? stage.monster;
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [hp, setHp] = useState<number | null>(null);
  const [clicks, setClicks] = useState(0);
  const [combo, setCombo] = useState(0);
  const [battleMaxCombo, setBattleMaxCombo] = useState(0);
  const [effects, setEffects] = useState<HitEffect[]>([]);
  const [defeated, setDefeated] = useState(false);
  const [bombUsed, setBombUsed] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const controls = useAnimation();
  const lastClickAt = useRef(0);
  const hpRef = useRef<number | null>(null);
  const clicksRef = useRef(0);
  const maxComboRef = useRef(0);
  const defeatedRef = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = getGameProgress();
      const activeStage = todayMonster ? stage : getStage(saved.currentMonsterIndex);
      if (!todayMonster) beginBattle(activeStage.monster, activeStage.index);
      setProgress(saved);
      setHp(activeStage.maxHp);
      hpRef.current = activeStage.maxHp;
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [beginBattle, stage, todayMonster]);

  const skillLevels = useMemo(() => ({
    combo: progress ? getSkillLevel(progress, "combo") : 0,
    critical: progress ? getSkillLevel(progress, "critical") : 0,
    auto: progress ? getSkillLevel(progress, "auto") : 0,
    bomb: progress ? getSkillLevel(progress, "bomb") : 0,
  }), [progress]);

  const addEffect = useCallback((damage: number, label: string) => {
    const effect = { id: Date.now() + Math.random(), damage, label, left: 30 + Math.random() * 42 };
    setEffects((current) => [...current, effect]);
    window.setTimeout(() => setEffects((current) => current.filter((item) => item.id !== effect.id)), 720);
  }, []);

  const finishBattle = useCallback((finalClicks: number, finalCombo: number) => {
    if (defeatedRef.current) return;
    defeatedRef.current = true;
    const reward = rewardDefeat(stage.index, finalCombo);
    const record = saveBattleRecord({
      monsterId: monster.id,
      monsterNickname: monster.title,
      actionTaken: "点击出击，成功清场",
      clicks: finalClicks,
      maxCombo: finalCombo,
      coinsEarned: reward.earnedCoins,
    });
    setProgress(reward.progress);
    setDefeated(true);
    setShowSkills(true);
    setLastBattle({
      recordId: record.id,
      monster,
      stageIndex: stage.index,
      clicks: finalClicks,
      maxCombo: finalCombo,
      coinsEarned: reward.earnedCoins,
      progress: reward.progress,
      awardedSkill: null,
    });
    controls.start({ rotate: [0, -10, 10, -6, 0], scale: [1, 1.16, 0.86, 1], transition: { duration: 0.55 } });
  }, [controls, monster, setLastBattle, stage.index]);

  const damageMonster = useCallback((damage: number, label: string, finalClicks: number, finalCombo: number) => {
    if (hpRef.current === null || defeatedRef.current) return;
    const nextHp = Math.max(0, hpRef.current - damage);
    hpRef.current = nextHp;
    setHp(nextHp);
    addEffect(damage, label);
    controls.start({ scale: [1, 0.82, 1.08, 1], x: [0, -7, 7, 0], transition: { duration: 0.23 } });
    if (nextHp === 0) finishBattle(finalClicks, finalCombo);
  }, [addEffect, controls, finishBattle]);

  const hitMonster = () => {
    if (!progress || hp === null || defeated) return;
    const now = Date.now();
    const nextCombo = now - lastClickAt.current < 620 ? combo + 1 : 1;
    const nextClicks = clicks + 1;
    lastClickAt.current = now;
    const nextProgress = recordClick(nextCombo);
    const noviceComboDamage = stage.index === 0 ? Math.floor(nextCombo / 5) : 0;
    const skillComboDamage = skillLevels.combo > 0 ? Math.floor(nextCombo / 5) * skillLevels.combo : 0;
    const comboDamage = noviceComboDamage + skillComboDamage;
    const critical = skillLevels.critical > 0 && Math.random() < Math.min(0.12 + skillLevels.critical * 0.08, 0.48);
    const damage = (1 + comboDamage) * (critical ? 3 : 1);
    navigator.vibrate?.(critical ? 18 : 8);
    clicksRef.current = nextClicks;
    maxComboRef.current = Math.max(maxComboRef.current, nextCombo);
    setProgress(nextProgress);
    setClicks(nextClicks);
    setCombo(nextCombo);
    setBattleMaxCombo((current) => Math.max(current, nextCombo));
    damageMonster(damage, critical ? "暴击！" : nextCombo >= 5 ? `${nextCombo} COMBO` : "啪！", nextClicks, maxComboRef.current);
  };

  const useBomb = () => {
    if (bombUsed || skillLevels.bomb === 0 || hpRef.current === null) return;
    setBombUsed(true);
    const damage = Math.ceil(stage.maxHp * 0.3) + (skillLevels.bomb - 1) * 10;
    damageMonster(damage, "BOOM!", clicks, battleMaxCombo);
  };

  useEffect(() => {
    if (skillLevels.auto === 0 || defeated || hpRef.current === null) return;
    const intervalId = window.setInterval(() => {
      damageMonster(skillLevels.auto, "AUTO", clicksRef.current, maxComboRef.current);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [damageMonster, defeated, skillLevels.auto]);

  const chooseSkill = (skill: SkillDefinition) => {
    const updated = acquireSkill(skill.id);
    const result = useMonsterStore.getState().lastBattle;
    if (result) updateBattleRecord(result.recordId, { skillAwarded: skill.name });
    setAwardedSkill(skill.id, updated);
    router.push("/trophy");
  };

  if (!progress || hp === null) {
    return <div className="min-h-svh flex items-center justify-center bg-[#FAF6EE] text-sm font-bold text-[#8E8677]">小怪正在冲过来...</div>;
  }

  const hpPercent = (hp / stage.maxHp) * 100;

  return (
    <div className="relative min-h-svh bg-[#FAF6EE] px-4 pb-5 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-5">
      <div className="mx-auto flex min-h-[calc(100svh_-_2rem_-_env(safe-area-inset-top))] max-w-sm flex-col gap-3">
        <header className="flex justify-between items-center">
          <button className="text-xs font-bold px-3 py-1.5 bg-white" style={SKB} onClick={() => router.push("/")}>← 逃跑</button>
          <span className="text-xs font-black text-[#E27B66]" style={FH}>STAGE {stage.index + 1} / {BATTLE_STAGES.length}</span>
          <span className="flex items-center gap-1 text-xs font-black text-[#E8AA42]">
            <CoinIcon className="h-4 w-4" />
            {progress.coins}
          </span>
        </header>

        <section className="bg-white p-3" style={SKB}>
          <div className="mb-1.5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#8E8677]">当前目标</p>
              <h1 className="text-xl font-black" style={FH}>{monster.title}</h1>
            </div>
            <p className="text-lg font-black text-[#D96B6B]">{hp} / {stage.maxHp}</p>
          </div>
          <div className="hp-bar">
            <motion.div className="hp-fill" animate={{ width: `${hpPercent}%` }} />
          </div>
        </section>

        <div className="relative flex min-h-[220px] flex-1 flex-col items-center justify-center py-1">
          <AnimatePresence>
            {effects.map((effect) => (
              <motion.div
                key={effect.id}
                className="absolute z-20 text-xl font-black text-[#E27B66]"
                style={{ left: `${effect.left}%`, top: "28%", ...FH, textShadow: "2px 2px 0 #2C2C2C" }}
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -62, scale: 1.4, rotate: -6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                -{effect.damage} {effect.label}
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.button animate={controls} whileTap={{ scale: 0.86 }} onClick={hitMonster} disabled={defeated}>
            <MonsterAvatar
              monsterId={monster.id}
              size={276}
              className="h-[clamp(12rem,29svh,17.25rem)] w-[clamp(12rem,29svh,17.25rem)]"
              defeated={defeated}
            />
          </motion.button>
          <AnimatePresence>
            {!defeated && combo > 1 && (
              <motion.p
                key={combo}
                className="text-2xl font-black text-[#E27B66] sm:text-3xl"
                style={FH}
                initial={{ scale: 0.4, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
              >
                x{combo} COMBO!
              </motion.p>
            )}
          </AnimatePresence>
          {defeated && <motion.p className="text-4xl font-black text-[#A1B57D]" style={FH} initial={{ scale: 0 }} animate={{ scale: 1.05 }}>CLEAR!</motion.p>}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
          <div className="bg-white py-1.5" style={SKB}>点击<br /><strong>{clicks}</strong></div>
          <div className="bg-white py-1.5" style={SKB}>最高连击<br /><strong>x{battleMaxCombo}</strong></div>
          <div className="bg-white py-1.5" style={SKB}>技能<br /><strong>{progress.ownedSkills.length}</strong></div>
        </div>

        {skillLevels.bomb > 0 && !defeated && (
          <motion.button
            className="w-full py-3 font-black text-[#2C2C2C]"
            style={{ ...SKB, ...FH, background: bombUsed ? "#EDE8DB" : "#E27B66" }}
            whileTap={{ scale: 0.96 }}
            disabled={bombUsed}
            onClick={useBomb}
          >
            {bombUsed ? "💣 坏念头已戳破" : "💣 戳破 3 个坏念头，小怪血量 -30%"}
          </motion.button>
        )}
      </div>

      {showSkills && (
        <SkillChoicePanel choices={getSkillChoices(stage.index)} onChoose={chooseSkill} />
      )}
    </div>
  );
}
