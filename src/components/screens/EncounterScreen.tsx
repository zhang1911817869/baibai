"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMonsterStore } from "@/stores/useMonsterStore";
import { MONSTERS, Monster } from "@/lib/monsters-data";
import type { ReactElement } from "react";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const SKBSM = { border: "1.5px solid #2C2C2C", borderRadius: "3px 5px 4px 6px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };
const CLOUD_EMOJIS = ["😩", "😤", "🤯", "😫", "🙃"];

// ── 毛绒绒小怪 SVG ──────────────────────────────────────
// 每只小怪有独特形象：多层绒毛 + Q版大眼 + 专属配件
function CuteMonster({ id, size = 72 }: { id: string; size?: number }) {
  const s = size;
  const configs: Record<string, ReactElement> = {

    // 绿色拖延怪 — 流口水的慵懒软泥
    procrastinate: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        {/* outer fur ring */}
        {[15,27,40,53,65,75].map((cx,i)=><circle key={i} cx={cx} cy={78} r={11} fill="#7EC8A0"/>)}
        {[10,22].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#7EC8A0"/>)}
        {[78,88].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#7EC8A0"/>)}
        <circle cx="12" cy="45" r="10" fill="#7EC8A0"/>
        <circle cx="88" cy="45" r="10" fill="#7EC8A0"/>
        <circle cx="20" cy="28" r="9" fill="#7EC8A0"/>
        <circle cx="80" cy="28" r="9" fill="#7EC8A0"/>
        {/* body */}
        <ellipse cx="50" cy="58" rx="36" ry="30" fill="#7EC8A0"/>
        <ellipse cx="50" cy="38" rx="30" ry="28" fill="#7EC8A0"/>
        {/* belly */}
        <ellipse cx="50" cy="60" rx="20" ry="14" fill="#B8E8CE" opacity="0.7"/>
        {/* highlight sheen */}
        <ellipse cx="35" cy="28" rx="8" ry="5" fill="white" opacity="0.25" transform="rotate(-20,35,28)"/>
        {/* big cute eyes */}
        <ellipse cx="36" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <ellipse cx="64" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <circle cx="36" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="64" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="38" cy="39" r="2" fill="white"/>
        <circle cx="66" cy="39" r="2" fill="white"/>
        {/* sleepy half-lid */}
        <path d="M27,36 Q36,32 45,36" fill="#7EC8A0" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M55,36 Q64,32 73,36" fill="#7EC8A0" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        {/* drool */}
        <path d="M46,58 Q44,66 42,70 Q40,73 38,70" fill="none" stroke="#A8D8EA" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="40" cy="72" r="3" fill="#A8D8EA" opacity="0.8"/>
        {/* mouth */}
        <path d="M38,62 Q50,58 62,62" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        {/* ZZZ */}
        <text x="72" y="22" fontSize="11" fill="#5F594F" fontWeight="bold" opacity="0.7">z</text>
        <text x="79" y="14" fontSize="8" fill="#8E8677" opacity="0.6">z</text>
      </svg>
    ),

    // 紫色压力怪 — 有犄角的愤怒球
    stress: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        {[15,27,40,53,65,75].map((cx,i)=><circle key={i} cx={cx} cy={78} r={11} fill="#9B7BBD"/>)}
        {[10,22].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#9B7BBD"/>)}
        {[78,88].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#9B7BBD"/>)}
        <circle cx="12" cy="45" r="10" fill="#9B7BBD"/>
        <circle cx="88" cy="45" r="10" fill="#9B7BBD"/>
        <circle cx="20" cy="28" r="9" fill="#9B7BBD"/>
        <circle cx="80" cy="28" r="9" fill="#9B7BBD"/>
        {/* horns */}
        <path d="M32,18 Q26,4 22,2 Q24,12 30,20" fill="#9B7BBD" stroke="#2C2C2C" strokeWidth="2"/>
        <path d="M68,18 Q74,4 78,2 Q76,12 70,20" fill="#9B7BBD" stroke="#2C2C2C" strokeWidth="2"/>
        <ellipse cx="50" cy="58" rx="36" ry="30" fill="#9B7BBD"/>
        <ellipse cx="50" cy="38" rx="30" ry="28" fill="#9B7BBD"/>
        <ellipse cx="50" cy="60" rx="20" ry="14" fill="#C9AADF" opacity="0.7"/>
        <ellipse cx="35" cy="28" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-20,35,28)"/>
        {/* angry eyes */}
        <ellipse cx="36" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <ellipse cx="64" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <circle cx="36" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="64" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="38" cy="39" r="2" fill="white"/>
        <circle cx="66" cy="39" r="2" fill="white"/>
        {/* angry brows */}
        <path d="M27,30 Q36,35 45,30" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M55,30 Q64,35 73,30" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round"/>
        {/* gritted teeth */}
        <path d="M36,62 Q50,68 64,62" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        <line x1="44" y1="62" x2="44" y2="66" stroke="#2C2C2C" strokeWidth="1.5"/>
        <line x1="50" y1="63" x2="50" y2="67" stroke="#2C2C2C" strokeWidth="1.5"/>
        <line x1="56" y1="62" x2="56" y2="66" stroke="#2C2C2C" strokeWidth="1.5"/>
        {/* steam */}
        <path d="M14,38 Q10,32 14,26 Q18,32 14,38" fill="#E27B66" opacity="0.6"/>
        <path d="M86,38 Q90,32 86,26 Q82,32 86,38" fill="#E27B66" opacity="0.6"/>
        <text x="45" y="12" fontSize="14" fill="#E27B66" fontWeight="bold" opacity="0.8">!</text>
      </svg>
    ),

    // 黄色过载怪 — 抱着一堆文件
    overload: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        {[15,27,40,53,65,75].map((cx,i)=><circle key={i} cx={cx} cy={78} r={11} fill="#E8AA42"/>)}
        {[10,22].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#E8AA42"/>)}
        {[78,88].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#E8AA42"/>)}
        <circle cx="12" cy="45" r="10" fill="#E8AA42"/>
        <circle cx="88" cy="45" r="10" fill="#E8AA42"/>
        <circle cx="20" cy="28" r="9" fill="#E8AA42"/>
        <circle cx="80" cy="28" r="9" fill="#E8AA42"/>
        <ellipse cx="50" cy="58" rx="36" ry="30" fill="#E8AA42"/>
        <ellipse cx="50" cy="38" rx="30" ry="28" fill="#E8AA42"/>
        <ellipse cx="50" cy="60" rx="20" ry="14" fill="#F5D08A" opacity="0.7"/>
        <ellipse cx="35" cy="28" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-20,35,28)"/>
        {/* papers stack */}
        <rect x="60" y="10" width="20" height="24" rx="2" fill="white" stroke="#2C2C2C" strokeWidth="1.5" transform="rotate(8,70,22)"/>
        <rect x="58" y="12" width="20" height="24" rx="2" fill="#FAF6EE" stroke="#2C2C2C" strokeWidth="1.5" transform="rotate(3,68,24)"/>
        <rect x="56" y="14" width="20" height="24" rx="2" fill="white" stroke="#2C2C2C" strokeWidth="1.5"/>
        <line x1="59" y1="20" x2="73" y2="20" stroke="#2C2C2C" strokeWidth="1"/>
        <line x1="59" y1="24" x2="73" y2="24" stroke="#2C2C2C" strokeWidth="1"/>
        <line x1="59" y1="28" x2="68" y2="28" stroke="#2C2C2C" strokeWidth="1"/>
        {/* flat overwhelmed eyes */}
        <ellipse cx="36" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <ellipse cx="64" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <circle cx="36" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="64" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="38" cy="39" r="2" fill="white"/>
        <circle cx="66" cy="39" r="2" fill="white"/>
        <path d="M27,35 Q36,33 45,35" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M55,35 Q64,33 73,35" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M38,60 Q50,56 62,60" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        {/* sweat */}
        <path d="M18,30 Q14,22 16,16 Q20,22 18,30" fill="#A8D8EA" opacity="0.8"/>
        {/* notification dots */}
        <circle cx="20" cy="14" r="5" fill="#D96B6B" stroke="#2C2C2C" strokeWidth="1"/>
        <text x="17.5" y="17" fontSize="6" fill="white" fontWeight="bold">99</text>
      </svg>
    ),

    // 蓝色脑雾怪 — 头顶一团雾
    brain_fog: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        {[15,27,40,53,65,75].map((cx,i)=><circle key={i} cx={cx} cy={78} r={11} fill="#7DB8D4"/>)}
        {[10,22].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#7DB8D4"/>)}
        {[78,88].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#7DB8D4"/>)}
        <circle cx="12" cy="45" r="10" fill="#7DB8D4"/>
        <circle cx="88" cy="45" r="10" fill="#7DB8D4"/>
        <circle cx="20" cy="28" r="9" fill="#7DB8D4"/>
        <circle cx="80" cy="28" r="9" fill="#7DB8D4"/>
        <ellipse cx="50" cy="58" rx="36" ry="30" fill="#7DB8D4"/>
        <ellipse cx="50" cy="38" rx="30" ry="28" fill="#7DB8D4"/>
        <ellipse cx="50" cy="60" rx="20" ry="14" fill="#A8D4E8" opacity="0.7"/>
        <ellipse cx="35" cy="28" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-20,35,28)"/>
        {/* fog cloud on head */}
        <circle cx="35" cy="14" r="9" fill="white" opacity="0.75"/>
        <circle cx="47" cy="9" r="11" fill="white" opacity="0.75"/>
        <circle cx="60" cy="12" r="9" fill="white" opacity="0.75"/>
        <circle cx="68" cy="18" r="7" fill="white" opacity="0.6"/>
        <circle cx="27" cy="18" r="7" fill="white" opacity="0.6"/>
        {/* question mark in fog */}
        <text x="45" y="17" fontSize="13" fill="#8E8677" fontWeight="bold" opacity="0.8">?</text>
        {/* dizzy spiral eyes */}
        <ellipse cx="36" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <ellipse cx="64" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        {/* spiral */}
        <path d="M36,38 Q40,36 40,40 Q40,44 36,44 Q32,44 32,40 Q32,37 35,37" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M64,38 Q68,36 68,40 Q68,44 64,44 Q60,44 60,40 Q60,37 63,37" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        {/* tired droopy brows */}
        <path d="M27,32 Q36,29 45,32" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M55,32 Q64,29 73,32" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M38,62 Q50,58 62,62" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        {/* sweat drops */}
        <path d="M80,38 Q84,30 82,24 Q78,30 80,38" fill="#A8D8EA" opacity="0.7"/>
      </svg>
    ),

    // 粉色社交怪 — 假笑带眼泪
    social: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        {[15,27,40,53,65,75].map((cx,i)=><circle key={i} cx={cx} cy={78} r={11} fill="#E27B98"/>)}
        {[10,22].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#E27B98"/>)}
        {[78,88].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#E27B98"/>)}
        <circle cx="12" cy="45" r="10" fill="#E27B98"/>
        <circle cx="88" cy="45" r="10" fill="#E27B98"/>
        <circle cx="20" cy="28" r="9" fill="#E27B98"/>
        <circle cx="80" cy="28" r="9" fill="#E27B98"/>
        <ellipse cx="50" cy="58" rx="36" ry="30" fill="#E27B98"/>
        <ellipse cx="50" cy="38" rx="30" ry="28" fill="#E27B98"/>
        <ellipse cx="50" cy="60" rx="20" ry="14" fill="#F0A8BC" opacity="0.7"/>
        <ellipse cx="35" cy="28" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-20,35,28)"/>
        {/* rosy cheeks */}
        <circle cx="24" cy="50" r="7" fill="#F0A8BC" opacity="0.6"/>
        <circle cx="76" cy="50" r="7" fill="#F0A8BC" opacity="0.6"/>
        {/* forced smile eyes — wide open */}
        <ellipse cx="36" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <ellipse cx="64" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <circle cx="36" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="64" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="38" cy="39" r="2.5" fill="white"/>
        <circle cx="66" cy="39" r="2.5" fill="white"/>
        {/* smile that doesn't reach eyes */}
        <path d="M34,61 Q50,70 66,61" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round"/>
        {/* tear */}
        <path d="M28,48 Q25,54 26,58 Q28,62 30,58 Q30,54 28,48" fill="#A8D8EA" opacity="0.85"/>
        {/* tiny haha */}
        <text x="38" y="76" fontSize="8" fill="#2C2C2C" opacity="0.5" style={{fontFamily:"serif"}}>哈哈</text>
      </svg>
    ),

    // 蓝灰低电怪 — 胸口显示低电量
    low_energy: (
      <svg width={s} height={s} viewBox="0 0 100 100">
        {[15,27,40,53,65,75].map((cx,i)=><circle key={i} cx={cx} cy={78} r={11} fill="#5B8DB8"/>)}
        {[10,22].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#5B8DB8"/>)}
        {[78,88].map((cx,i)=><circle key={i} cx={cx} cy={62} r={10} fill="#5B8DB8"/>)}
        <circle cx="12" cy="45" r="10" fill="#5B8DB8"/>
        <circle cx="88" cy="45" r="10" fill="#5B8DB8"/>
        <circle cx="20" cy="28" r="9" fill="#5B8DB8"/>
        <circle cx="80" cy="28" r="9" fill="#5B8DB8"/>
        <ellipse cx="50" cy="58" rx="36" ry="30" fill="#5B8DB8"/>
        <ellipse cx="50" cy="38" rx="30" ry="28" fill="#5B8DB8"/>
        <ellipse cx="50" cy="60" rx="20" ry="14" fill="#8AB4D4" opacity="0.7"/>
        <ellipse cx="35" cy="28" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-20,35,28)"/>
        {/* battery on chest */}
        <rect x="36" y="54" width="28" height="15" rx="3" fill="white" stroke="#2C2C2C" strokeWidth="1.5"/>
        <rect x="64" y="58" width="4" height="7" rx="1.5" fill="#2C2C2C"/>
        <rect x="37.5" y="55.5" width="5" height="12" rx="2" fill="#D96B6B"/>
        <text x="46" y="65" fontSize="7" fill="#5F594F" fontWeight="bold">LOW</text>
        {/* half-closed tired eyes */}
        <ellipse cx="36" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <ellipse cx="64" cy="40" rx="9" ry="10" fill="white" stroke="#2C2C2C" strokeWidth="2"/>
        <circle cx="36" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="64" cy="42" r="5.5" fill="#2C2C2C"/>
        <circle cx="38" cy="39" r="2" fill="white"/>
        <circle cx="66" cy="39" r="2" fill="white"/>
        {/* heavy eyelids */}
        <path d="M27,36 Q36,32 45,36" fill="#5B8DB8" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M55,36 Q64,32 73,36" fill="#5B8DB8" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
        {/* droopy mouth */}
        <path d="M38,74 Q50,70 62,74" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
        {/* zzz */}
        <text x="74" y="24" fontSize="10" fill="#8AB4D4" fontWeight="bold" opacity="0.8">Z</text>
        <text x="82" y="16" fontSize="7" fill="#8AB4D4" opacity="0.6">z</text>
      </svg>
    ),
  };

  return configs[id] ?? configs.procrastinate;
}

export default function EncounterScreen() {
  const { setMonster } = useMonsterStore();
  const [selected, setSelected] = useState<Monster | null>(null);
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const allPopped = popped.size >= CLOUD_EMOJIS.length;

  return (
    <div className="relative min-h-svh bg-[#FAF6EE] px-5 pt-7 pb-32 overflow-x-hidden">
      {/* Notebook rings */}
      <div className="absolute left-1 top-1/3 flex flex-col gap-4 z-20 pointer-events-none">
        {[0,1,2].map(i=><div key={i} className="w-5 h-4 bg-stone-200" style={{border:"2px solid #2C2C2C",borderRadius:"50% / 60%"}}/>)}
      </div>

      <div className="space-y-4 ml-5">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#2C2C2C]" style={FH}>拜拜小怪</h1>
          <p className="text-[11px] text-[#8E8677] mt-0.5">今天哪只小怪来找你了？</p>
        </div>

        {/* Warning */}
        <motion.div className="flex justify-center" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}>
          <div className="px-3 py-1 text-xs font-bold" style={{...SKBSM,background:"#D96B6B",color:"#FAF6EE",...FH}}>
            ⚠️ 不是你有问题，是小怪来了！
          </div>
        </motion.div>

        {/* 6 monsters grid — 3 columns */}
        <div className="grid grid-cols-3 gap-2">
          {MONSTERS.map((m, i) => {
            const isSel = selected?.id === m.id;
            return (
              <motion.button key={m.id}
                className="flex flex-col items-center pt-3 pb-2 px-1 relative"
                style={isSel
                  ? { ...SKB, background:"#FFF8E8" }
                  : { ...SKBSM, background:"#FAF6EE" }}
                whileTap={{scale:0.9}}
                onClick={()=>setSelected(m)}
                initial={{opacity:0,scale:0.85}}
                animate={{opacity:1,scale:1}}
                transition={{delay:i*0.06, type:"spring", bounce:0.4}}
              >
                {isSel && (
                  <motion.div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                    style={{background:"#E8AA42",border:"1.5px solid #2C2C2C",color:"#2C2C2C"}}
                    initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",bounce:0.7}}>✓</motion.div>
                )}
                <motion.div
                  animate={isSel ? {y:[0,-5,0]} : {y:0}}
                  transition={{repeat:isSel?Infinity:0, duration:2, ease:"easeInOut"}}
                >
                  <CuteMonster id={m.id} size={68} />
                </motion.div>
                <span className="text-[10px] font-black text-[#2C2C2C] text-center leading-tight mt-1" style={FH}>
                  {m.title}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Description */}
        <AnimatePresence>
          {selected && (
            <motion.div className="p-3 text-xs text-[#5F594F] leading-relaxed" style={SKBSM}
              initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <span className="font-bold text-[#2C2C2C]">档案：</span>{selected.description}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5 cloud bubbles */}
        <div className="p-3 flex flex-col items-center"
          style={{border:"1.5px dashed #2C2C2C",borderRadius:"6px 8px 7px 9px",background:"#FAF6EE"}}>
          <p className="text-[10px] text-[#8E8677] mb-2.5 text-center">
            💡 先戳破5个焦虑气泡，削弱小怪气场：
          </p>
          <div className="flex gap-2.5 justify-center">
            {CLOUD_EMOJIS.map((emoji,i)=>(
              <AnimatePresence key={i}>
                {!popped.has(i) ? (
                  <motion.button
                    style={{width:44,height:44,borderRadius:"50%",border:"1.5px solid #2C2C2C",
                      background:"#A1B57D",boxShadow:"2px 2px 0 #2C2C2C",
                      fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}
                    whileTap={{scale:0.5}}
                    exit={{scale:0,opacity:0}}
                    transition={{duration:0.25,type:"spring",bounce:0.3}}
                    onClick={()=>setPopped(p=>new Set([...p,i]))}
                  >{emoji}</motion.button>
                ) : (
                  <motion.div key={`d${i}`}
                    style={{width:44,height:44,borderRadius:"50%",border:"1.5px solid #EDE8DB",
                      background:"#EDE8DB",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",opacity:0.4}}
                    initial={{scale:1.3}} animate={{scale:1}}>✓</motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
          <AnimatePresence>
            {allPopped && (
              <motion.p className="text-[10px] text-[#A1B57D] font-bold mt-2"
                initial={{opacity:0}} animate={{opacity:1}}>
                ✓ 全部戳破！小怪气场 -50% ⚡
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        {selected ? (
          <Link href="/naming" onClick={()=>setMonster(selected)}>
            <motion.button className="w-full py-4 font-black text-lg flex items-center justify-center gap-2"
              style={{...SKB,background:"#E8AA42",color:"#2C2C2C",...FH}}
              whileTap={{scale:0.96}}>
              ⚔️ 收服「{selected.title}」
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </Link>
        ) : (
          <div className="w-full py-4 font-black text-lg flex items-center justify-center"
            style={{...SKBSM,background:"#EDE8DB",color:"#8E8677",...FH}}>
            先点一只小怪 👆
          </div>
        )}
        <p className="text-[10px] text-center text-[#8E8677] italic pb-4">
          * 全程不超过1分钟，随时可逃跑
        </p>
      </div>
    </div>
  );
}
