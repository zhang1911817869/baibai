# 拜拜小怪

一个用小游戏流程陪伴用户处理拖延、压力、脑雾与低能量状态的 Next.js 应用。

用户从今日小怪开始，依次完成命名、回血和出招，最后获得一张突围卡。已完成的战绩保存在当前浏览器的 `localStorage` 中，不需要账号或后端服务即可体验完整流程。

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
| `/` | 选择今日小怪 |
| `/naming` | 给小怪命名 |
| `/recovery` | 进行轻量恢复动作 |
| `/strike` | 执行出招步骤 |
| `/trophy` | 查看并分享突围卡 |
| `/history` | 查看当前设备上的历史与统计 |

## 主要目录

```text
src/
  app/                    页面入口、全局布局和分享图片
  components/screens/     游戏流程屏幕组件
  components/ui/          基础 UI 组件
  lib/
    battle-history.ts     本地战绩持久化与统计
    monsters-data.ts      小怪内容数据
  stores/                 跨步骤前端状态
```

## 数据说明

当前版本不会将战绩上传到服务器。清除浏览器站点数据会同时清除本地战绩。如果未来需要登录、云同步或跨设备排行，应作为独立功能设计和实现。

部署到自定义域名时，可配置 `NEXT_PUBLIC_SITE_URL=https://your-domain.example`，用于生成正确的社交分享链接。
