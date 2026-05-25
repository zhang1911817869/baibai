"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMonsterStore } from "@/stores/useMonsterStore";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const SKBSM = { border: "1.5px solid #2C2C2C", borderRadius: "3px 5px 4px 6px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

const VISUALS: Record<string, { color: string; accent: string }> = {
  procrastinate: { color: "#7EC8A0", accent: "#B8E8CE" },
  stress:        { color: "#9B7BBD", accent: "#C9AADF" },
  overload:      { color: "#E8AA42", accent: "#F5D08A" },
  brain_fog:     { color: "#7DB8D4", accent: "#A8D4E8" },
  social:        { color: "#E27B98", accent: "#F0A8BC" },
  low_energy:    { color: "#5B8DB8", accent: "#8AB4D4" },
};

// 20 hits to defeat
const MAX_HP = 200;
const HIT_DMG = 10;

// Hit FX labels cycle
const HIT_LABELS = ["💥", "BAM!", "暴击!", "多巴胺+1", "意志力↑", "解压!", "✨", "SMASH!", "爽~", "冲!"];

function playHitSound(hits: number) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    // Pitch varies with hit count — gets higher as you go
    const baseFreq = 150 + Math.min(hits * 8, 200);
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
  } catch {}
}

function playDefeatSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    [523, 659, 784, 1047, 1318].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.25);
    });
  } catch {}
}

interface HitFx { id: number; x: number; y: number; label: string }

// Furry monster SVG (compact inline version)
function FurryMonsterBig({ color, accent, hp }: { color: string; accent: string; hp: number }) {
  const beaten = hp <= 0;
  const damaged = hp < 100;
  return (
    <svg width="150" height="150" viewBox="0 0 80 80">
      {[14,29,51,66].map((cx,i)=><circle key={i} cx={cx} cy={63} r={9} fill={color}/>)}
      <circle cx="10" cy="49" r="9" fill={color}/>
      <circle cx="70" cy="49" r="9" fill={color}/>
      <circle cx="18" cy="30" r="9" fill={color}/>
      <circle cx="62" cy="30" r="9" fill={color}/>
      <ellipse cx="40" cy="51" rx="28" ry="23" fill={color}/>
      <ellipse cx="40" cy="36" rx="24" ry="22" fill={color}/>
      <ellipse cx="40" cy="54" rx="16" ry="11" fill={accent} opacity="0.55"/>
      {/* Eyes react to damage */}
      {!beaten ? <>
        <ellipse cx="30" cy="35" rx="6" ry={damaged ? 5 : 7} fill="white" stroke="#2C2C2C" strokeWidth="1.5"/>
        <ellipse cx="50" cy="35" rx="6" ry={damaged ? 5 : 7} fill="white" stroke="#2C2C2C" strokeWidth="1.5"/>
        <circle cx="30" cy={damaged ? 37 : 36} r="3" fill="#2C2C2C"/>
        <circle cx="50" cy={damaged ? 37 : 36} r="3" fill="#2C2C2C"/>
        {damaged && <>
          <path d="M24,29 Q30,33 36,29" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M44,29 Q50,33 56,29" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        </>}
        <path d={damaged ? "M33,54 Q40,50 47,54" : "M33,52 Q40,56 47,52"} fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
      </> : <>
        {/* defeated — X eyes */}
        <path d="M24,30 L36,42 M36,30 L24,42" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M44,30 L56,42 M56,30 L44,42" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M30,56 Q40,60 50,56" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        {/* Stars around defeated monster */}
        <text x="4" y="20" fontSize="10">⭐</text>
        <text x="60" y="18" fontSize="10">⭐</text>
        <text x="32" y="8" fontSize="10">🌟</text>
      </>}
      {/* Sweat drops when damaged */}
      {damaged && !beaten && <path d="M65,22 Q62,16 64,12 Q67,16 65,22" fill="#A8D8EA" opacity="0.8"/>}
    </svg>
  );
}

export default function StrikeScreen() {
  const router = useRouter();
  const { todayMonster, setCurrentAction } = useMonsterStore();
  const [hp, setHp] = useState(MAX_HP);
  const [hits, setHits] = useState(0);
  const [hitFx, setHitFx] = useState<HitFx[]>([]);
  const [actionIdx, setActionIdx] = useState(0);
  const [defeated, setDefeated] = useState(false);
  const monsterControls = useAnimation();
  const actions = useMemo(() => todayMonster?.strikeActions ?? [], [todayMonster]);

  const handleHit = useCallback(() => {
    if (defeated) return;
    const newHits = hits + 1;
    const newHp = Math.max(0, hp - HIT_DMG);
    setHits(newHits);
    setHp(newHp);
    playHitSound(newHits);

    // Monster shake animation
    monsterControls.start({
      x: [0, -10, 10, -8, 8, -4, 4, 0],
      rotate: [0, -6, 6, -4, 4, 0],
      scale: [1, 0.88, 1.05, 1],
      transition: { duration: 0.35 },
    });

    // Hit FX floating text
    const id = Date.now() + Math.random();
    const label = HIT_LABELS[newHits % HIT_LABELS.length];
    const x = 30 + Math.random() * 90;
    const y = 20 + Math.random() * 40;
    setHitFx(fx => [...fx, { id, x, y, label }]);
    setTimeout(() => setHitFx(fx => fx.filter(f => f.id !== id)), 900);

    if (newHp <= 0) {
      playDefeatSound();
      setDefeated(true);
      setCurrentAction(actions[actionIdx] ?? "");
      monsterControls.start({
        rotate: [0, 15, -15, 10, -10, 0],
        scale: [1, 1.2, 0.9, 1.1, 0.95, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [hits, hp, defeated, actions, actionIdx, monsterControls, setCurrentAction]);

  useEffect(() => {
    if (!todayMonster) router.replace("/");
  }, [router, todayMonster]);

  if (!todayMonster) return null;

  const vis = VISUALS[todayMonster.id] ?? { color: "#E8AA42", accent: "#F5D08A" };
  const hpPct = Math.max(0, (hp / MAX_HP) * 100);

  return (
    <div className="relative min-h-svh bg-[#FAF6EE] px-5 pt-8 pb-28 overflow-hidden">
      <div className="absolute left-1 top-32 flex flex-col gap-5 z-20 pointer-events-none">
        {[0,1].map(i=><div key={i} className="w-5 h-4 bg-stone-200" style={{border:"2px solid #2C2C2C",borderRadius:"50% / 55%"}}/>)}
      </div>

      <div className="space-y-4 ml-5">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <motion.button className="text-xs font-bold text-[#5F594F] bg-white px-2.5 py-1" style={SKBSM}
            whileTap={{scale:0.95}} onClick={()=>router.push("/recovery")}>
            ← 返回
          </motion.button>
          <span className="text-xs font-mono font-bold text-[#8E8677] border-b border-dashed border-[#2C2C2C]">
            STEP 03 / 03
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-1.5" style={FH}>
            <span className="w-6 h-6 rounded-full bg-[#E8AA42] flex items-center justify-center text-xs font-black" style={SKBSM}>3</span>
            出招！狠狠打
          </h3>
          <p className="text-xs text-[#E27B66] font-semibold mt-1">
            {defeated ? "🎉 击败！小怪被你收服了！" : `已打 ${hits} 下 · 还剩 ${Math.ceil(hp / HIT_DMG)} 下`}
          </p>
        </div>

        {/* HP bar */}
        <div>
          <div className="flex justify-between text-[10px] font-bold text-[#5F594F] mb-1">
            <span>「{todayMonster.title}」血量</span>
            <span style={{color: hpPct < 30 ? "#D96B6B" : "#5F594F"}}>{Math.round(hpPct)}%</span>
          </div>
          <div className="hp-bar">
            <motion.div className="hp-fill"
              animate={{width:`${hpPct}%`}}
              style={{background: hpPct < 30 ? "repeating-linear-gradient(45deg,#D96B6B,#D96B6B 6px,#E27B66 6px,#E27B66 12px)" : undefined}}
              transition={{duration:0.25}}/>
          </div>
        </div>

        {/* Monster hit area */}
        <div className="relative flex justify-center items-center py-2" style={{minHeight:180}}>
          {/* Hit FX */}
          <AnimatePresence>
            {hitFx.map(fx=>(
              <motion.div key={fx.id}
                className="absolute font-black text-base pointer-events-none z-30 select-none"
                style={{left:fx.x, top:fx.y, color:"#E27B66", ...FH, textShadow:"1px 1px 0 #2C2C2C"}}
                initial={{opacity:1,y:0,scale:1}}
                animate={{opacity:0,y:-55,scale:1.5}}
                exit={{opacity:0}}
                transition={{duration:0.8,ease:"easeOut"}}
              >{fx.label}</motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            animate={monsterControls}
            className="flex flex-col items-center cursor-pointer select-none"
            whileTap={!defeated ? {scale:0.85} : {}}
            onClick={handleHit}
            disabled={defeated}
            style={{background:"none",border:"none",padding:0}}
          >
            <FurryMonsterBig color={vis.color} accent={vis.accent} hp={hp}/>
            {!defeated ? (
              <p className="text-[11px] text-[#8E8677] mt-1 animate-pulse">点击小怪攻击！</p>
            ) : (
              <motion.p className="text-sm font-black text-[#A1B57D] mt-1" style={FH}
                initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",bounce:0.6}}>
                🎉 成功收服！
              </motion.p>
            )}
            {/* Hit counter badge */}
            {hits > 0 && (
              <motion.div className="mt-1 px-2 py-0.5 text-xs font-black text-white"
                style={{background:"#E27B66",border:"1.5px solid #2C2C2C",borderRadius:12,...FH}}
                animate={{scale:[1,1.2,1]}} transition={{duration:0.15}}>
                ×{hits}
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Action card */}
        <div style={{...SKB,background:"#FAF6EE"}} className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-xl shrink-0">🎯</div>
            <div className="flex-1">
              <p className="text-[10px] text-[#8E8677] font-bold uppercase mb-1">现在做这一件事（30秒内）</p>
              <AnimatePresence mode="wait">
                <motion.p key={actionIdx} className="text-sm font-bold text-[#2C2C2C]"
                  initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}
                  transition={{duration:0.2}}>
                  {actions[actionIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <motion.button className="mt-2.5 text-xs font-bold text-[#5F594F] px-3 py-1.5 bg-white" style={SKBSM}
            whileTap={{scale:0.93}}
            onClick={()=>setActionIdx(i=>(i+1)%actions.length)}>
            换一个动作 →
          </motion.button>
        </div>

        {/* CTA — only shows when defeated */}
        <AnimatePresence>
          {defeated && (
            <motion.button
              className="w-full py-4 text-white font-black text-base flex items-center justify-center gap-2"
              style={{...SKB,...FH,background:"#E8AA42"}}
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{type:"spring",bounce:0.4}}
              whileTap={{scale:0.97}}
              onClick={()=>router.push("/trophy")}
            >
              ✓ 收割战利品！
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
