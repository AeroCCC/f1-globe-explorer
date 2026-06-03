# F1 全球赛道探索器

基于 React、Vite、React Three Fiber 和 Three.js 的 F1 全球赛道 3D 地球探索单页应用。

当前版本聚焦 Web 桌面端体验：用户可以在 3D 地球上查看当前赛季赛道点位，点击赛道后右侧详情抽屉会更新赛道信息，底部状态栏同步展示赛季、已加载赛道数量、当前选中赛道、数据来源和连接状态。

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
Serverless Runtime: nodejs22.x
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

`db:import:history` 会从 Jolpica/Ergast 兼容接口导入当前 22 个分站的历史正赛冠军结果，并写入 `races` 与 `race_results`。该命令可重复执行，已有记录会按 `circuit_id + season + round` 幂等更新；马德里站是 2026 新赛道，当前数据源没有往年完赛结果，因此会保持空历史状态。

## 当前能力

- 真实 3D 地球、云层和星空背景。
- 2026 赛季 22 条赛道静态种子数据。
- Vercel Postgres 迁移、seed 和 API 数据库优先读取。
- Jolpica 历史正赛冠军导入，21 个有历史完赛结果的当前分站已具备历史页数据。
- DeepSeek 中文 AI 赛道解读接口、JSON 校验和 `ai_insights` 缓存。
- 赛道 Marker、选中高亮和悬浮提示。
- 点击赛道后自动聚焦到对应经纬度。
- 右侧赛道详情抽屉。
- 底部状态栏。
- 当前可见界面已完成中文化。

## 开发边界

目前只开发 Web 桌面端产品体验，暂不开发移动端适配。

## 演示素材

作品集录制流程见 [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md)。
