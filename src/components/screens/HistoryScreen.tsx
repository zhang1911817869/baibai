"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CoinIcon } from "@/components/game/coin-icon";
import { getBattleRecords, type BattleRecord } from "@/lib/battle-history";
import { getGameProgress, getTitle, type GameProgress } from "@/lib/game-progress";

type BoardKey = "totalClicks" | "todayClicks" | "maxCombo";

interface LeaderRow {
  name: string;
  value: number;
  mine?: boolean;
}

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 7px 5px 8px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

const mockRows: Record<BoardKey, LeaderRow[]> = {
  totalClicks: [{ name: "电量满格王", value: 860 }, { name: "先打再说", value: 426 }, { name: "深呼吸选手", value: 180 }],
  todayClicks: [{ name: "午休拳王", value: 120 }, { name: "开工就揍", value: 78 }, { name: "不拖到明天", value: 42 }],
  maxCombo: [{ name: "连点艺术家", value: 56 }, { name: "手速解压员", value: 36 }, { name: "清醒三秒钟", value: 20 }],
};

export default function HistoryScreen() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [records, setRecords] = useState<BattleRecord[]>([]);
  const [board, setBoard] = useState<BoardKey>("totalClicks");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProgress(getGameProgress());
      setRecords(getBattleRecords());
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const rows = useMemo(() => {
    if (!progress) return [];
    return [
      ...mockRows[board],
      { name: "我", value: progress[board], mine: true },
    ].sort((a, b) => b.value - a.value);
  }, [board, progress]);

  if (!progress) {
    return <div className="min-h-svh flex items-center justify-center bg-[#FAF6EE] text-sm font-bold text-[#8E8677]">排行榜加载中...</div>;
  }

  return (
    <div className="min-h-svh bg-[#FAF6EE] px-5 pt-7 pb-28">
      <div className="mx-auto max-w-sm space-y-4">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black" style={FH}>突围排行榜</h1>
            <p className="text-xs text-[#5F594F]">本地数据 + 模拟好友排行，先看爽感够不够。</p>
          </div>
          <Link href="/shop" className="flex items-center gap-1 px-3 py-2 text-xs font-black bg-[#E8AA42]" style={SKB}>
            <CoinIcon className="h-4 w-4" />
            {progress.coins}
          </Link>
        </header>

        <section className="grid grid-cols-3 gap-2 text-center">
          <div className="py-2 bg-white" style={SKB}><p className="text-[10px] text-[#8E8677]">击败</p><strong>{progress.defeatedMonsters}</strong></div>
          <div className="py-2 bg-white" style={SKB}><p className="text-[10px] text-[#8E8677]">点击</p><strong>{progress.totalClicks}</strong></div>
          <div className="py-2 bg-white" style={SKB}><p className="text-[10px] text-[#8E8677]">称号</p><strong className="text-[11px]">{getTitle(progress)}</strong></div>
        </section>

        <div className="grid grid-cols-3 gap-2">
          {([
            ["totalClicks", "总点击榜"],
            ["todayClicks", "今日点击榜"],
            ["maxCombo", "最高连击榜"],
          ] as [BoardKey, string][]).map(([key, label]) => (
            <button
              key={key}
              className="py-2 text-[11px] font-black"
              style={{ ...SKB, background: board === key ? "#E8AA42" : "#FFFFFF" }}
              onClick={() => setBoard(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="space-y-2">
          {rows.map((row, index) => (
            <motion.div
              key={`${board}-${row.name}`}
              className="flex items-center gap-3 p-3"
              style={{ ...SKB, background: row.mine ? "#FFF1C8" : "#FFFFFF" }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="w-7 text-xl text-center">{["🥇", "🥈", "🥉"][index] ?? `${index + 1}`}</span>
              <div className="flex-1">
                <p className="text-sm font-black">{row.name} {row.mine && <span className="text-[#E27B66]">← 你</span>}</p>
                {row.mine && <p className="text-[10px] text-[#8E8677]">继续打一只，名次马上变化</p>}
              </div>
              <strong className="text-xl text-[#E8AA42]" style={FH}>
                {board === "maxCombo" ? `x${row.value}` : row.value}
              </strong>
            </motion.div>
          ))}
        </section>

        <section className="bg-white p-3" style={SKB}>
          <h2 className="text-base font-black mb-2" style={FH}>最近收服的小怪</h2>
          {records.length === 0 ? (
            <p className="text-xs text-[#8E8677]">还没有战绩，回首页 1 秒开打吧。</p>
          ) : (
            records.slice(0, 3).map((record) => (
              <div key={record.id} className="flex justify-between py-2 border-b border-dashed border-stone-200 last:border-0 text-xs">
                <span className="font-bold">⭐ {record.monsterNickname}</span>
                <span className="text-[#8E8677]">x{record.maxCombo ?? 0} 连击</span>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
