import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ZCOOL_KuaiLe, Inter } from "next/font/google";
import { cn } from "@/utils/utils";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/BottomNav";

const zcoolKuaiLe = ZCOOL_KuaiLe({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-body",
});

// Set NEXT_PUBLIC_SITE_URL in production when using a custom domain.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const SITE_TITLE = "拜拜小怪";
const SITE_DESCRIPTION = "游戏化情绪陪伴——打怪打跑拖延、压力、脑雾，全程1分钟，输入即爽。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // Social preview cards (Open Graph + Twitter). Most platforms (X,
  // Facebook, LinkedIn, Slack, Discord, WeChat, iMessage) read these
  // tags directly. For the preview image, drop a 1200×630 PNG/JPG at
  // `src/app/opengraph-image.png` — Next.js auto-detects file-based
  // metadata and overrides `openGraph.images` below at build time.
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={cn("h-full antialiased", zcoolKuaiLe.variable, inter.variable)}>
      <body className="min-h-svh flex flex-col bg-[#FAF6EE]" style={{ fontFamily: "var(--font-body, 'Inter'), sans-serif" }}>
        <main className="flex-1">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
