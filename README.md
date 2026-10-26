# F1 全球赛道探索器

基于 React、Vite、React Three Fiber 和 Three.js 的 F1 全球赛道 3D 地球探索单页应用。

在 3D 地球上查看 2026 赛季 24 条赛道点位，点击赛道后右侧详情抽屉展示赛道概览、历史冠军、赛历信息和 AI 赛道工程分析，底部状态栏同步展示赛季、已加载赛道数、当前选中赛道、数据来源与连接状态。

<img width="2059" height="1229" alt="微信图片_20260603234054_188_17" src="https://github.com/user-attachments/assets/8ad40c2f-cd09-400e-acd0-8c87873cd0c7" />

## 功能特性

- 2026 赛季 24 条赛道的真实 3D 地球（含云层与星空背景）。
- 赛道 Marker、选中高亮与悬浮提示，点击后自动聚焦到对应经纬度。
- 右侧详情抽屉四个标签页：概览 / 历史冠军 / 赛历 / AI 工程解读。
- 底部状态栏，展示赛季、已加载赛道数、当前选中赛道、数据来源与连接状态。
- 数据库优先读取，缺失时回退到静态种子数据。
- Jolpica 历史正赛冠军导入，24 个分站中 23 站具备历史数据（马德里为 2026 新赛道，无往年完赛结果）。
- DeepSeek 结构化中文 AI 赛道工程分析，覆盖赛道特性、调校重点、轮胎与刹车、超车节奏、车手要求、策略风险、数据可信度与数据说明。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端 | React 19、Vite 8、React Three Fiber、@react-three/drei、Three.js |
| API | Vercel Serverless Functions |
| 数据库 | Neon Postgres（`@neondatabase/serverless`） |
| AI | DeepSeek Chat Completions（`deepseek-v4-flash`） |
| 历史数据 | Jolpica / Ergast 兼容接口（api.jolpi.ca） |
| 测试 / 质量 | Vitest、ESLint |
| 运行时 | Node 24.x |

## 项目结构

```text
├── api/circuits/           # Vercel Serverless API 端点
│   ├── index.js            # 赛道列表
│   └── [circuitId]/        # 详情 / 历史 / 赛历 / AI 解读
├── src/                    # 前端 React 应用
│   ├── globe/              # 3D 地球场景与赛道 Marker
│   ├── features/
│   │   ├── circuits/       # 赛道静态种子数据
│   │   ├── drawer/         # 详情抽屉与四个标签页
│   │   ├── api/            # API 客户端与资源状态
│   │   ├── app-state/      # 页面状态 hooks
│   │   ├── status/         # 底部状态栏
│   │   └── common/         # 通用状态组件
│   ├── App.jsx
│   └── main.jsx
├── server/                 # 服务端共享逻辑
│   ├── clients/            # DeepSeek、Jolpica 客户端
│   ├── services/           # 赛道、AI 解读、历史导入服务
│   ├── repositories/       # 数据访问层
│   ├── dto/                # 数据转换
│   ├── http/               # API 响应工具
│   └── db/                 # 数据库连接、迁移、seed、导入脚本
├── docs/                   # 设计文档与演示指南
├── vercel.json
└── vite.config.js
```

## 本地开发

前置要求：Node 24.x。

```powershell
npm install
```

复制环境变量模板并填写：

```powershell
cp .env.local.example .env.local
```

`.env.local` 需要包含：

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-v4-flash
```

开发命令：

```powershell
npm run dev        # 启动开发服务器
npm run lint       # ESLint
npm test           # Vitest 测试
npm run build      # 生产构建
```

## API 端点

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/circuits` | 赛道列表 |
| GET | `/api/circuits/[circuitId]` | 赛道详情 |
| GET | `/api/circuits/[circuitId]/history` | 历史冠军 |
| GET | `/api/circuits/[circuitId]/calendar` | 赛历信息 |
| GET | `/api/circuits/[circuitId]/ai-insight` | AI 解读（读取缓存） |
| POST | `/api/circuits/[circuitId]/ai-insight` | AI 解读（生成） |

## 数据库

使用 Vercel Marketplace 绑定的 Neon Postgres。准备好 `.env.local` 后执行：

```powershell
npm run db:migrate
npm run db:seed
npm run db:import:history
npm run db:verify
```

`db:import:history` 从 Jolpica/Ergast 兼容接口导入当前 24 个分站的历史正赛冠军结果，写入 `races` 与 `race_results`。该命令可重复执行，已有记录按 `circuit_id + season + round` 幂等更新；马德里站是 2026 新赛道，当前数据源没有往年完赛结果，因此保持空历史状态。

## 部署

Vercel 导入 GitHub 仓库后保持默认 Vite 配置即可，仓库内已提供 `vercel.json`：

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
Node Engine: 24.x
```

在 Vercel 项目环境变量中配置 `DATABASE_URL`、`DEEPSEEK_API_KEY`、`DEEPSEEK_MODEL`。绑定 Neon Marketplace 时会自动注入数据库连接变量。

## 文档

- [第二阶段开发说明](docs/F1_Globe_Explorer_Phase2_Development_Document.md)
- [演示录制指南](docs/DEMO_GUIDE.md)

## 开发边界

目前只开发 Web 桌面端产品体验，暂不开发移动端适配。
