"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  {
    href: "/",
    label: "今日手账",
    svgPath: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  },
  {
    href: "/history",
    label: "怪兽图鉴",
    svgPath: "M4 6h16M4 10h16M4 14h10M4 18h6",
  },
];

const GAME_ROUTES = ["/naming", "/recovery", "/strike", "/trophy"];

export function BottomNav() {
  const pathname = usePathname();
  if (GAME_ROUTES.includes(pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 md:hidden pb-[env(safe-area-inset-bottom)]"
      style={{ background: "#FAF6EE", borderTop: "2.5px solid #2C2C2C", boxShadow: "0 -3px 0 #2C2C2C" }}
    >
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href} className="flex-1">
              <motion.div
                className="flex flex-col items-center gap-1 py-1"
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={active ? "#E8AA42" : "#8E8677"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={tab.svgPath} />
                </svg>
                <span
                  className="text-[11px] font-bold"
                  style={{
                    fontFamily: "var(--font-heading, 'ZCOOL KuaiLe'), cursive",
                    color: active ? "#E8AA42" : "#8E8677",
                  }}
                >
                  {tab.label}
                </span>
                {active && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#E8AA42" }}
                    layoutId="tab-dot"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
