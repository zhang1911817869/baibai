"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMonsterStore } from "@/stores/useMonsterStore";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const SKBSM = { border: "1.5px solid #2C2C2C", borderRadius: "3px 5px 4px 6px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

// Short preset tags — max 6 chars each
const PRESETS = ["拒绝开始", "红点恐吓犯", "划手机专家", "明天再说", "假装很忙", "拖延大师"];

export default function NamingScreen() {
  const router = useRouter();
  const { todayMonster, setChosenName } = useMonsterStore();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!todayMonster) router.replace("/");
  }, [router, todayMonster]);

  if (!todayMonster) return null;

  const commit = () => {
    setChosenName(name.trim() || todayMonster.nickname);
    router.push("/recovery");
  };

  return (
    <div className="relative min-h-svh bg-[#FAF6EE] px-5 pt-8 pb-28">
      <div className="absolute left-2 top-32 flex flex-col gap-5 z-20 pointer-events-none">
        {[0,1].map((i) => (
          <div key={i} className="w-5 h-4 bg-stone-200"
            style={{ border: "1.5px solid #2C2C2C", borderRadius: "50% / 55%" }} />
        ))}
      </div>

      <div className="space-y-5 ml-4">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <motion.button className="text-xs font-bold text-[#5F594F] bg-white px-2.5 py-1 flex items-center gap-1"
            style={SKBSM} whileTap={{ scale: 0.95 }} onClick={() => router.push("/")}>
            ← 溜走
          </motion.button>
          <span className="text-xs font-mono font-bold text-[#8E8677] border-b border-dashed border-[#2C2C2C]">
            STEP 01 / 03
          </span>
        </div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-2xl font-bold text-[#2C2C2C] flex items-center gap-1.5" style={FH}>
            <span className="w-6 h-6 rounded-full bg-[#E8AA42] flex items-center justify-center text-xs font-black"
              style={SKBSM}>1</span>
            给它起个名
          </h3>
          <p className="text-xs text-[#5F594F] mt-1 leading-relaxed">
            叫出名字，恐惧感会<span className="bg-[#E8AA42] px-1 font-bold text-[#2C2C2C]">立刻降低30%</span>
          </p>
        </motion.div>

        {/* Input */}
        <motion.div className="bg-[#FAF6EE] p-4 relative" style={SKB}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="absolute right-3 top-3 text-lg opacity-70">✍️</div>
          <label className="block text-[10px] font-bold text-[#5F594F] mb-2 uppercase tracking-wide">
            给「{todayMonster.nickname}」赐个外号
          </label>
          <input
            className="w-full bg-white px-3 py-2.5 text-sm text-[#2C2C2C] placeholder-[#8E8677] focus:outline-none"
            style={SKBSM}
            placeholder="例：今日废人包、周五综合症..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </motion.div>

        {/* Preset tags */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-xs font-bold text-[#2C2C2C] mb-2">💡 也可以直接选：</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((tag) => (
              <motion.button
                key={tag}
                className="text-xs px-3 py-1.5 bg-white text-[#2C2C2C] font-bold"
                style={name === tag ? { ...SKB, background: "#E8AA42" } : SKBSM}
                whileTap={{ scale: 0.92 }}
                onClick={() => setName(tag)}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-dashed border-[#2C2C2C]">
          <motion.button className="text-xs font-bold text-[#5F594F] px-4 py-3 bg-white" style={SKBSM}
            whileTap={{ scale: 0.95 }} onClick={() => router.push("/")}>
            不打了
          </motion.button>
          <motion.button className="flex-1 py-3.5 px-4 bg-[#A1B57D] text-white font-black text-base flex items-center justify-center gap-2"
            style={{ ...SKB, ...FH }}
            whileTap={{ scale: 0.97 }}
            onClick={commit}>
            已命名，去回血
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
