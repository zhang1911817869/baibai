# Agent Guide

This repository contains **拜拜小怪**, a standalone, Bun-first Next.js clicker game about defeating everyday emotional "monsters".

## Stack

- Next.js 16 with App Router
- React 19 and TypeScript
- Tailwind CSS v4
- Bun for package management and scripts
- Zustand for in-browser flow state
- framer-motion and shadcn/ui primitives for UI

## Commands

```bash
bun install
bun dev
bun run lint
bun run build
bun start
```

## Product Flow

| Route | Screen | Purpose |
|---|---|---|
| `/` | `HomeScreen` | Show today's current stage and start combat in one tap |
| `/strike` | `StrikeScreen` | Click combat, damage effects, skills and reward choice |
| `/trophy` | `TrophyScreen` | Receive/share the result card and nickname the defeated monster |
| `/history` | `HistoryScreen` | View local simulated leaderboards and records |
| `/shop` | `ShopScreen` | Spend virtual coins on skills and collectibles |
| `/challenge` | `EncounterScreen` | Optional legacy daily challenge with monster selection |
| `/naming`, `/recovery` | Legacy screens | Optional challenge steps retained after the main-flow redesign |

The transient battle flow state lives in `src/stores/useMonsterStore.ts`. Progress, skills, coins, and click statistics are saved by `src/lib/game-progress.ts`; battle cards/history are saved by `src/lib/battle-history.ts`. Preserve this offline-first behavior unless the user explicitly requests a server-backed account or sync feature.

## Structure

```text
src/
  app/
    layout.tsx               Root metadata and shared shell
    page.tsx                 Thin home route entry
    <route>/page.tsx         Thin route entries
    opengraph-image.tsx      Social preview image
  components/
    game/                    Combat-facing reusable UI
    screens/                 Feature screens
    ui/                      Reusable UI primitives
    BottomNav.tsx            Global mobile navigation
  lib/
    battle-history.ts        Local record persistence and aggregation
    game-config.ts           Stages, skills and shop inventory
    game-progress.ts         Local progression and economy
    monsters-data.ts         Monster definitions and copy
  stores/
    useMonsterStore.ts       Current encounter state
  utils/
    utils.ts                 Shared CSS utility helpers
```

## Coding Requirements

- Keep `page.tsx` files thin: import one screen or feature component and render it.
- Keep one exported React component per component file.
- Group new components by feature rather than collecting unrelated components together.
- Extract stateful or substantial UI sections into their own files.
- Use `@/` aliases for application imports.
- Prefer typed helpers in `src/lib/` for persistence, parsing, or shared data operations.
- Keep the existing browser-only gameplay usable without environment variables or external services.
- Do not add product branding, SDKs, authentication, telemetry, notification systems, or hosted-data dependencies from outside platforms unless the user specifically requests that integration.

## File Size Guidance

| File type | Soft limit | Hard limit |
|---|---:|---:|
| Route `page.tsx` | 30 lines | 50 lines |
| Feature component | 150 lines | 250 lines |
| Utility / helper | 80 lines | 150 lines |

## Before Shipping

Run:

```bash
bun run lint
bun run build
```
