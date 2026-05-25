"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CoinIcon } from "@/components/game/coin-icon";
import { SHOP_ITEMS } from "@/lib/game-config";
import { getGameProgress, getSkillLevel, purchaseItem, type GameProgress } from "@/lib/game-progress";

const SKB = { border: "2.5px solid #2C2C2C", borderRadius: "4px 7px 5px 8px" as const, boxShadow: "3px 3px 0 #2C2C2C" };
const FH = { fontFamily: "var(--font-heading,'ZCOOL KuaiLe'),cursive" };

export default function ShopScreen() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [message, setMessage] = useState("击败小怪、连出组合拳，都能挣金币。");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setProgress(getGameProgress()), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!progress) {
    return <div className="min-h-svh flex items-center justify-center bg-[#FAF6EE] text-sm font-bold text-[#8E8677]">商店开门中...</div>;
  }

  const buy = (itemId: string) => {
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item) return;
    const result = purchaseItem(item);
    setProgress(result.progress);
    setMessage(result.ok ? `已获得「${item.name}」！马上去试试。` : "金币不够，先去揍一只小怪吧。");
  };

  return (
    <div className="min-h-svh bg-[#FAF6EE] px-5 pt-7 pb-28">
      <div className="mx-auto max-w-sm space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black" style={FH}>金币商店</h1>
            <p className="text-xs text-[#5F594F]">只花游戏金币，不接真实支付。</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-2 bg-white text-lg font-black text-[#E8AA42]" style={SKB}>
            <CoinIcon className="h-5 w-5" />
            {progress.coins}
          </div>
        </header>

        <div className="p-3 text-xs font-bold text-[#5F594F] bg-[#FFF8E8]" style={SKB}>💡 {message}</div>

        <section className="space-y-3">
          {SHOP_ITEMS.map((item, index) => {
            const skillLevel = item.skillId ? getSkillLevel(progress, item.skillId) : 0;
            const collected = !item.skillId && progress.purchasedItems.includes(item.id);
            return (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 bg-white p-3"
                style={SKB}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-black">{item.name} {skillLevel > 0 && <span className="text-[#E27B66]">Lv.{skillLevel}</span>}</p>
                  <p className="text-[10px] text-[#8E8677]">{collected ? "已收藏" : item.description}</p>
                </div>
                <button
                  className="px-3 py-2 text-xs font-black"
                  style={{ ...SKB, background: collected ? "#EDE8DB" : "#E8AA42" }}
                  disabled={collected}
                  onClick={() => buy(item.id)}
                >
                  {collected ? "拥有" : (
                    <span className="flex items-center gap-1">
                      <CoinIcon className="h-4 w-4" />
                      {item.cost}
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </section>

        <Link href="/" className="block w-full py-3.5 text-center font-black bg-[#E8AA42]" style={{ ...SKB, ...FH }}>
          返回首页开打 🥊
        </Link>
      </div>
    </div>
  );
}
