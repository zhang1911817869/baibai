"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMonsterStore } from "@/stores/useMonsterStore";
import { saveBattleRecord } from "@/lib/battle-history";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const SKBSM = { border: "1.5px solid #2C2C2C", borderRadius: "3px 5px 4px 6px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

export default function TrophyScreen() {
  const router = useRouter();
  const { todayMonster, chosenName, currentAction } = useMonsterStore();
  const [sharing, setSharing] = useState(false);
  const savedRef = useRef(false);

  const monster = todayMonster;
  const today = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });

  useEffect(() => {
    if (!monster || savedRef.current) return;
    savedRef.current = true;

    saveBattleRecord({
      monsterNickname: chosenName || monster.nickname,
      actionTaken: currentAction || monster.strikeActions[0],
    });
  }, [monster, chosenName, currentAction]);

  useEffect(() => {
    if (!monster) router.replace("/");
  }, [monster, router]);

  if (!monster) return null;

  const handleShare = async () => {
    setSharing(true);
    const text = `我用「拜拜小怪」打败了「${chosenName || monster.nickname}」！\n执行动作：${currentAction || monster.strikeActions[0]}\n科学原理：${monster.trophyExplanation}\n\n#拜拜小怪 #打怪突围`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "拜拜小怪｜今日突围卡", text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("突围卡文字已复制到剪贴板！");
      }
    } catch {}
    setSharing(false);
  };

  return (
    <div className="relative min-h-svh bg-[#FAF6EE] px-5 pt-8 pb-28">
      <div className="absolute left-2 top-32 flex flex-col gap-5 z-20 pointer-events-none">
        {[0,1,2].map((i) => (
          <div key={i} className="w-5 h-4 bg-stone-200"
            style={{ border: "1.5px solid #2C2C2C", borderRadius: "50% / 55%" }} />
        ))}
      </div>

      <div className="space-y-5 ml-4">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <motion.button className="text-xs font-bold text-[#5F594F] bg-white px-2.5 py-1" style={SKBSM}
            whileTap={{ scale: 0.95 }} onClick={() => router.push("/")}>
            ← 返回
          </motion.button>
          <motion.span
            className="text-[10px] font-black px-2 py-0.5 text-white"
            style={{ background: "#A1B57D", border: "1px solid #2C2C2C", borderRadius: 3, ...FH }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
            ACTION CLEAR ✓
          </motion.span>
        </div>

        {/* Title */}
        <motion.div className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold text-[#2C2C2C]" style={FH}>突围成功！</h2>
          <p className="text-xs text-[#E27B66] font-bold mt-1">「放过自己，也是一种极好的战术出招。」</p>
        </motion.div>

        {/* Trophy card — shareable polaroid */}
        <motion.div
          className="bg-white p-5 relative overflow-hidden max-w-sm mx-auto"
          style={{ ...SKB, boxShadow: "8px 8px 0 #2C2C2C", transform: "rotate(1deg)" }}
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 1 }}
          transition={{ type: "spring", bounce: 0.3, delay: 0.15 }}
        >
          {/* Tape strip */}
          <div className="absolute -top-2 left-1/3 right-1/3 h-5 bg-[#E8AA4244]"
            style={{ border: "1px solid #E8AA4299", transform: "rotate(-1.5deg)", borderRadius: 2 }} />

          <div className="flex justify-between text-[9px] font-bold text-[#8E8677] border-b border-dashed border-stone-200 pb-2 mb-3">
            <span>拜拜小怪 · LIFE BODY</span>
            <span>{today}</span>
          </div>

          {/* Card body */}
          <div className="text-center py-3 mb-3"
            style={{ border: "1.5px dashed #2C2C2C", borderRadius: "6px 8px 7px 9px", background: "#FAF6EE" }}>
            <div className="text-4xl mb-1">🌟</div>
            <h3 className="text-lg font-black text-[#2C2C2C]" style={FH}>
              打败「{chosenName || monster.nickname}」
            </h3>
            <p className="text-[9px] text-[#8E8677] font-bold uppercase mt-1">
              今日突围 1 次成功
            </p>
          </div>

          {/* Action taken */}
          <div className="mb-3 px-3 py-2 bg-[#FFF8E8]"
            style={{ border: "1.5px solid #E8AA42", borderRadius: "3px 5px 4px 6px" }}>
            <p className="text-[10px] text-[#8E8677] font-bold mb-0.5">✅ 执行的动作</p>
            <p className="text-xs font-bold text-[#2C2C2C]">{currentAction || monster.strikeActions[0]}</p>
          </div>

          {/* Science */}
          <div>
            <span className="text-[9px] font-black text-[#E27B66] uppercase tracking-wider block mb-1">
              🔬 为什么有效？
            </span>
            <p className="text-[11px] text-[#5F594F] leading-relaxed">{monster.trophyExplanation}</p>
          </div>

          <div className="flex justify-between mt-4 pt-2 border-t border-dashed border-stone-200 text-[9px] text-[#8E8677] font-bold">
            <span>你好，老己。</span>
            <span>拜拜小怪 APP</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div className="flex flex-col gap-2.5"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <motion.button
            className="w-full py-4 text-[#2C2C2C] font-black text-base flex items-center justify-center gap-2"
            style={{ ...SKB, ...FH, background: "#FAF6EE" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            disabled={sharing}
          >
            <svg className="w-5 h-5 text-[#E27B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {sharing ? "分享中..." : "分享突围卡"}
          </motion.button>

          <motion.button
            className="w-full py-4 text-white font-black text-base flex items-center justify-center gap-2"
            style={{ ...SKB, ...FH, background: "#E8AA42" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { router.push("/"); }}
          >
            收起卡片，迎接下一战 ⚔️
          </motion.button>

          <motion.button
            className="w-full py-3 text-[#5F594F] font-bold text-sm flex items-center justify-center gap-1"
            style={{ ...SKBSM, background: "#FAF6EE" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/history")}
          >
            查看我的打怪历史 →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
