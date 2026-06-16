# F1 全球赛道探索器

基于 React、Vite、React Three Fiber 和 Three.js 的 F1 全球赛道 3D 地球探索单页应用。

当前版本聚焦 Web 桌面端体验：用户可以在 3D 地球上查看 2026 赛季赛道点位，点击赛道后右侧详情抽屉会更新赛道信息、历史冠军、赛历信息和 AI 赛道工程分析，底部状态栏同步展示赛季、已加载赛道数量、当前选中赛道、数据来源和连接状态。

<img width="2059" height="1229" alt="微信图片_20260603234054_188_17" src="https://github.com/user-attachments/assets/8ad40c2f-cd09-400e-acd0-8c87873cd0c7" />

## 技术栈

- React 19、Vite 8、React Three Fiber、Three.js。
- Vercel Serverless API。
- Neon Postgres，使用 `@neondatabase/serverless` 访问。
- DeepSeek Chat Completions，用于生成中文赛道工程分析。
- Vitest 与 ESLint。

## 开发命令

```powershell
npm run dev
npm run lint
npm test
npm run build
```

## 部署

Vercel 导入 GitHub 仓库后保持默认 Vite 配置即可，仓库内已提供 `vercel.json`：

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
Node Engine: 24.x
```

Vercel 项目环境变量需要配置：

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-v4-flash
```

本地未链接 `.vercel` 时，先在 Vercel Dashboard 完成项目导入和环境变量配置，再部署。

## 数据库命令

本项目使用 Vercel Marketplace 绑定的 Neon Postgres。先在本地准备 `.env.local`，至少包含：

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-v4-flash
```

然后执行：

```powershell
npm run db:migrate
npm run db:seed
npm run db:import:history
npm run db:verify
```

`db:import:history` 会从 Jolpica/Ergast 兼容接口导入当前 24 个分站的历史正赛冠军结果，并写入 `races` 与 `race_results`。该命令可重复执行，已有记录会按 `circuit_id + season + round` 幂等更新；马德里站是 2026 新赛道，当前数据源没有往年完赛结果，因此会保持空历史状态。

## 当前能力

- 真实 3D 地球、云层和星空背景。
- 2026 赛季 24 条赛道静态种子数据。
- Vercel Postgres 迁移、seed 和 API 数据库优先读取。
- Jolpica 历史正赛冠军导入，23 个有历史完赛结果的当前分站已具备历史页数据。
- DeepSeek 中文 AI 赛道工程分析接口，覆盖赛道特性、调校重点、轮胎与刹车、超车节奏、策略风险、数据可信度和数据说明。
- `ai_insights` 使用 `track_engineering_v1` 缓存类型，兼容旧版缓存字段并支持重复生成时优先读缓存。
- `App.jsx` 已拆分业务状态到 `src/features/app-state` hooks，页面组件主要负责组合地球、抽屉和底部状态栏。
- 赛道列表、Tab 资源和全局连接状态具备 database/static fallback 与错误状态边界。
- 赛道 Marker、选中高亮和悬浮提示。
- 点击赛道后自动聚焦到对应经纬度。
- 右侧赛道详情抽屉。
- 底部状态栏。
- 当前可见界面已完成中文化。

## 第二阶段进度

- 数据口径已统一到 2026 赛季 24 站。
- 数据库迁移已补充 `season`、`round` 与 AI 工程分析缓存类型。
- 前端新增 `useCircuitsResource`、`useSelectedCircuit`、`useCircuitTabResources`、`useGlobeSelection`，用于隔离页面状态、赛道选择和 Tab 资源加载。
- AI 解读已从普通介绍升级为结构化赛道工程分析。
- 第二阶段开发说明见 [docs/F1_Globe_Explorer_Phase2_Development_Document.md](docs/F1_Globe_Explorer_Phase2_Development_Document.md)。

## 开发边界

目前只开发 Web 桌面端产品体验，暂不开发移动端适配。

## 演示素材

作品集录制流程见 [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md)。
