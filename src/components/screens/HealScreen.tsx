"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMonsterStore } from "@/stores/useMonsterStore";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const SKBSM = { border: "1.5px solid #2C2C2C", borderRadius: "3px 5px 4px 6px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

// Recovery action per monster type — from document action pools
const RECOVERY_ACTIONS: Record<string, { title: string; instruction: string; emoji: string }> = {
  stress:        { title: "深呼吸3次", instruction: "闭眼深呼吸，吸4秒、憋2秒、呼6秒", emoji: "🌬️" },
  procrastinate: { title: "站起来30秒", instruction: "原地站起来，走三步，坐回去", emoji: "🚶" },
  overload:      { title: "开启勿扰10分钟", instruction: "把手机屏幕扣下，或开启勿扰模式", emoji: "🔕" },
  brain_fog:     { title: "站起来30秒", instruction: "站起来，原地跳5下，或做5次深蹲", emoji: "🏃" },
  social:        { title: "写一句退场话术", instruction: "复制一句：我现在有点累，晚点认真回你", emoji: "✍️" },
  low_energy:    { title: "喝一杯水", instruction: "慢慢喝一杯水，或者吃一口东西", emoji: "💧" },
};

export default function RecoveryScreen() {
  const router = useRouter();
  const { todayMonster } = useMonsterStore();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!todayMonster) router.replace("/");
  }, [router, todayMonster]);

  if (!todayMonster) return null;

  const action = RECOVERY_ACTIONS[todayMonster.id] ?? RECOVERY_ACTIONS.stress;

  return (
    <div className="relative min-h-svh bg-[#FAF6EE] px-5 pt-8 pb-28">
      <div className="absolute left-1 top-32 flex flex-col gap-5 z-20 pointer-events-none">
        {[0,1].map(i=><div key={i} className="w-5 h-4 bg-stone-200" style={{border:"2px solid #2C2C2C",borderRadius:"50% / 55%"}}/>)}
      </div>

      <div className="space-y-5 ml-5">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <motion.button className="text-xs font-bold text-[#5F594F] bg-white px-2.5 py-1" style={SKBSM}
            whileTap={{scale:0.95}} onClick={()=>router.push("/naming")}>
            ← 返回
          </motion.button>
          <span className="text-xs font-mono font-bold text-[#8E8677] border-b border-dashed border-[#2C2C2C]">
            STEP 02 / 03
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-1.5" style={FH}>
            <span className="w-6 h-6 rounded-full bg-[#E8AA42] flex items-center justify-center text-xs font-black" style={SKBSM}>2</span>
            先回血
          </h3>
          <p className="text-xs text-[#5F594F] mt-1">每种小怪有它的回血方式</p>
        </div>

        {/* Action card */}
        <div className="bg-[#FAF6EE] p-5 text-center" style={SKB}>
          <div className="text-5xl mb-3">{action.emoji}</div>
          <h4 className="text-xl font-black text-[#2C2C2C] mb-2" style={FH}>
            {action.title}
          </h4>
          <p className="text-sm text-[#5F594F] leading-relaxed mb-4">
            {action.instruction}
          </p>
          <motion.button
            className="px-5 py-2.5 font-bold text-sm text-white"
            style={{...SKBSM, background: done ? "#A1B57D" : "#E8AA42"}}
            whileTap={{scale:0.93}}
            onClick={()=>setDone(true)}
          >
            {done ? "✓ 已完成" : "点击标记完成"}
          </motion.button>
        </div>

        {/* Hint */}
        <div className="p-3 text-xs text-[#5F594F] leading-relaxed"
          style={{border:"1.5px dashed #2C2C2C",borderRadius:"6px 8px 7px 9px",background:"#FAF6EE"}}>
          💡 <span className="font-bold text-[#2C2C2C]">为什么有效？</span>
          身体微动作激活副交感神经，比硬撑更快让状态回升。
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2 pt-2">
          <motion.button
            className="w-full py-3.5 px-4 font-black text-base flex items-center justify-center gap-2"
            style={{...SKB,...FH,background: done ? "#E8AA42" : "#A1B57D",color:"#FAF6EE"}}
            whileTap={{scale:0.97}}
            onClick={()=>router.push("/strike")}
          >
            {done ? "回血完成，出击！🥊" : "跳过回血，直接出招"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
