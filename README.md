# 拜拜小怪

一个用点击小游戏陪伴用户处理拖延、压力、脑雾与低能量状态的 Next.js 应用。

用户打开首页即可一键开打，依次击败拖延、压力、脑雾、信息过载、社交耗电与低电量六只小怪，通过连击、暴击、自动拍打器和坏念头炸弹逐渐变强。通关后生成战绩卡，并可在本地排行榜和虚拟金币商店继续积累成就。

已完成的进度、技能、金币与战绩都保存在当前浏览器的 `localStorage` 中，不需要账号或后端服务即可体验完整流程。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Bun
- Zustand
- framer-motion
- shadcn/ui primitives

## 本地开发

```bash
bun install
bun dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 检查与构建

```bash
bun run lint
bun run build
bun start
```

## 页面流程

| 页面 | 功能 |
|---|---|
| `/` | 今日小怪首页，一键开始打怪 |
| `/strike` | 点击战斗、技能生效与通关技能选择 |
| `/trophy` | 查看/分享战绩卡，通关后给小怪起外号 |
| `/history` | 本地模拟排行榜和最近战绩 |
| `/shop` | 用游戏金币购买技能及收藏道具 |
| `/challenge` | 保留的每日挑战入口：选怪、命名与回血 |

## 主要目录

```text
src/
  app/                    页面入口、全局布局和分享图片
  components/screens/     游戏流程屏幕组件
  components/ui/          基础 UI 组件
  lib/
    battle-history.ts     本地战绩持久化
    game-progress.ts      点击、技能、金币与关卡进度
    game-config.ts        关卡、技能和商店配置
    monsters-data.ts      小怪内容数据
  stores/                 跨步骤前端状态
```

## 数据说明

当前版本不会将战绩上传到服务器。排行榜中的其他玩家为轻量体验验证用的模拟数据，用户自己的成绩来自本机真实记录。清除浏览器站点数据会同时清除本地进度。

部署到自定义域名时，可配置 `NEXT_PUBLIC_SITE_URL=https://your-domain.example`，用于生成正确的社交分享链接。

## GitHub Pages 试玩部署

仓库已配置 GitHub Actions。在 GitHub 创建公开仓库 `zhang1911817869/baibai` 并推送 `main` 分支后，到仓库 `Settings > Pages` 将 `Source` 设为 `GitHub Actions`。工作流会自动导出并发布站点：

[https://zhang1911817869.github.io/baibai/](https://zhang1911817869.github.io/baibai/)

若修改仓库名称，需要同时更新 `.github/workflows/deploy-pages.yml` 中的 `NEXT_PUBLIC_BASE_PATH` 与 `NEXT_PUBLIC_SITE_URL`。
