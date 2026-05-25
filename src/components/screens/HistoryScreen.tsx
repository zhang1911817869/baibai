"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getBattleRecords,
  getBattleSummary,
  type BattleRecord,
  type BattleSummary,
} from "@/lib/battle-history";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 6px 5px 7px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const SKBSM = { border: "1.5px solid #2C2C2C", borderRadius: "3px 5px 4px 6px" as const };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

type Tab = "mine" | "summary";

export default function HistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("mine");
  const [records, setRecords] = useState<BattleRecord[]>([]);
  const [summary, setSummary] = useState<BattleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const localRecords = getBattleRecords();
      setRecords(localRecords);
      setSummary(getBattleSummary(localRecords));
      setLoading(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="relative min-h-svh bg-[#FAF6EE] px-5 pt-8 pb-28">
      <div className="absolute left-2 top-32 flex flex-col gap-5 z-20 pointer-events-none">
        {[0,1,2].map((i) => (
          <div key={i} className="w-5 h-4 bg-stone-200"
            style={{ border: "1.5px solid #2C2C2C", borderRadius: "50% / 55%" }} />
        ))}
      </div>

      <div className="space-y-5 ml-4">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-[#2C2C2C]" style={FH}>
            怪兽图鉴
          </h2>
          <p className="text-xs text-[#5F594F] mt-0.5">你打败过的小怪，以及这台设备上的战绩统计</p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex gap-2">
          {(["mine", "summary"] as Tab[]).map((t) => (
            <motion.button
              key={t}
              className="px-4 py-2 text-sm font-bold"
              style={tab === t
                ? { ...SKB, background: "#E8AA42", color: "#2C2C2C", ...FH }
                : { ...SKBSM, background: "#FAF6EE", color: "#8E8677" }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setTab(t)}
            >
              {t === "mine" ? "📖 我的历史" : "🏆 本机统计"}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg" style={{ background: "#EDE8DB", ...SKBSM }} />
            ))}
          </div>
        ) : tab === "mine" ? (
          <div className="space-y-3">
            {records.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-sm text-[#8E8677]" style={FH}>还没有打怪记录</p>
                <motion.button
                  className="mt-4 px-5 py-2.5 font-bold text-sm"
                  style={{ ...SKB, background: "#E8AA42", color: "#2C2C2C", ...FH }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/")}
                >
                  去打第一只怪 ⚔️
                </motion.button>
              </div>
            ) : (
              records.map((r, i) => (
                <motion.div
                  key={r.id}
                  className="bg-white p-3.5 flex items-center justify-between"
                  style={SKBSM}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: "#FFF8E8", border: "1.5px solid #E8AA42" }}>
                      ⭐
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#2C2C2C]">{r.monsterNickname}</p>
                      <p className="text-[10px] text-[#8E8677] mt-0.5">
                        {r.actionTaken.length > 20 ? r.actionTaken.slice(0, 20) + "..." : r.actionTaken}
                        {" · "}
                        {new Date(r.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 font-bold text-[#5F594F]"
                    style={{ background: "#EDE8DB", borderRadius: 99, border: "1px solid #D8D2C4" }}>
                    已退隐
                  </span>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-[#8E8677]">你的浏览器里，哪些小怪最常被你击退——</p>
            {summary.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🏜️</p>
                <p className="text-sm text-[#8E8677]" style={FH}>统计还是空的</p>
                <p className="text-xs text-[#8E8677] mt-1">完成一次突围后，这里会留下记录</p>
              </div>
            ) : (
              summary.map((row, i) => (
                <motion.div
                  key={row.monsterNickname}
                  className="bg-white p-3.5 flex items-center gap-3"
                  style={i === 0 ? { ...SKBSM, background: "#FFF8E8", boxShadow: "3px 3px 0 #E8AA42" } : SKBSM}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="text-2xl w-8 text-center shrink-0">
                    {medals[i] ?? `${i + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#2C2C2C] truncate">{row.monsterNickname}</p>
                    <p className="text-[10px] text-[#8E8677] mt-0.5">
                      最近打败：{new Date(row.lastAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-black text-[#E8AA42]" style={FH}>{row.total}</p>
                    <p className="text-[9px] text-[#8E8677]">只</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Footer motto */}
        <div className="p-3 flex items-center gap-3"
          style={{ border: "1.5px dashed #2C2C2C", borderRadius: "6px 8px 7px 9px", background: "#FFF8E8" }}>
          <span className="text-lg">🛎️</span>
          <p className="text-[11px] text-[#5F594F] leading-relaxed font-semibold">
            「你今天遇到的怪兽没有惩罚你，它们只是脑部超载的信号。放过自己，也是出招。」
          </p>
        </div>
      </div>
    </div>
  );
}
