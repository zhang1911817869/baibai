"use client";

import { motion } from "framer-motion";
import type { SkillDefinition } from "@/lib/game-config";

interface SkillChoicePanelProps {
  choices: SkillDefinition[];
  onChoose: (skill: SkillDefinition) => void;
}

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "5px 8px 6px 9px" as const, boxShadow: "4px 4px 0 #2C2C2C" };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

export function SkillChoicePanel({ choices, onChoose }: SkillChoicePanelProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[#2C2C2C]/35 p-4 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-sm bg-[#FAF6EE] p-4"
        style={SKB}
        initial={{ y: 80, rotate: -1 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.32 }}
      >
        <p className="text-center text-[10px] font-black text-[#E27B66]">LEVEL UP!</p>
        <h2 className="text-center text-2xl font-black text-[#2C2C2C] mb-1" style={FH}>选一个技能</h2>
        <p className="text-center text-xs text-[#8E8677] mb-4">选完立即生效，下一只会打得更爽</p>
        <div className="space-y-2.5">
          {choices.map((skill, index) => (
            <motion.button
              key={skill.id}
              className="w-full flex items-center gap-3 bg-white p-3 text-left"
              style={SKB}
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChoose(skill)}
            >
              <span className="text-3xl">{skill.icon}</span>
              <span>
                <span className="block text-base font-black text-[#2C2C2C]" style={FH}>{skill.name}</span>
                <span className="block text-[11px] text-[#5F594F]">{skill.description}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
