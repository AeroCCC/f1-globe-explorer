# F1 Globe Explorer 第二阶段开发文档

> 阶段定位：在现有全栈 MVP 基础上，提高数据可信度、前端状态边界和 AI 解读专业度。
> 开发边界：本阶段仅包含数据一致性与可信度、`App.jsx` 业务状态拆分、AI 解读升级为“赛道工程分析”。
> 页面边界：继续保持单页面桌面 Web 体验，不新增顶部导航栏、不新增左侧面板、不改变 Stitch 初稿确定的视觉方向。

---

## 1. 阶段概述

### 1.1 当前基础

当前项目已经完成 3D 地球、赛道 Marker、右侧动态侧边栏、底部状态栏、Serverless API、Postgres 数据库、Jolpica 历史导入与 DeepSeek AI 解读缓存。

第二阶段不重建工程，不重做视觉方案，而是在现有结构上补齐数据可信度、拆清前端状态职责，并把 AI 解读从“通用说明”提升为更适合作品集展示的“赛道工程分析”。

---

### 1.2 第二阶段目标

1. 统一 2026 赛季赛历、赛道数量、赛道 seed、数据库 seed、README 与页面状态栏中的数据口径。
2. 将 `App.jsx` 中的业务状态拆分到专用 hooks，降低后续扩展搜索、预取、分享链接和错误恢复时的维护成本。
3. 将 AI 解读升级为结构化的赛道工程分析，覆盖赛道特性、赛车调校、车手要求、策略影响与风险提示。

---

### 1.3 不包含内容

本阶段不包含以下内容：

1. 不开发移动端适配。
2. 不新增左侧搜索面板。
3. 不开发机器学习预测。
4. 不开发车辆轨迹回放。
5. 不改动已确认的 Stitch 视觉基准。
6. 不引入新的后端常驻服务。

---

## 2. 数据一致性与可信度

### 2.1 目标

建立一套可验证的数据口径，使前端展示、数据库内容、README、开发文档和后端接口返回保持一致。

本阶段优先解决“页面显示的赛道数量、赛季赛历、seed 数据、数据库数据、历史导入状态是否一致”的问题。

---

### 2.2 当前问题

当前项目中已经存在多处数据来源：

1. `src/features/circuits/circuitSeed.js` 静态赛道数据。
2. Postgres 中的 `circuits`、`races`、`race_results`、`ai_insights`。
3. Jolpica 导入的历史赛果。
4. Serverless API 返回的 DTO。
5. README 与开发文档中的能力描述。
6. 页面底部状态栏中的赛季、赛道数量和数据源状态。

如果这些来源没有统一校验，后续会出现页面显示 24 站、README 写 22 站、数据库 seed 又是另一个数量的情况。此类问题会直接降低项目可信度。

---

### 2.3 数据口径

第二阶段以 2026 赛季为当前赛季口径。

赛历数据应优先参考官方 Formula 1 与 FIA 已发布赛历。第三方数据源仅用于补充历史结果、会话数据或接口字段，不作为赛季站数的最终裁决来源。

数据源职责划分：

```text
官方 F1 / FIA      当前赛季赛历、站数、分站顺序
Jolpica F1        Ergast 兼容历史赛果、分站历史结果
OpenF1            2023 年以后 session、位置、天气、车手、stint 等扩展数据
Postgres          项目内部标准化数据、缓存、展示所需聚合结果
静态 seed         本地开发和数据库不可用时的 fallback
```

---

### 2.4 任务

1. 审核 `CURRENT_SEASON`、赛道数量、分站顺序、大奖赛名称和赛道名称。
2. 更新 `circuitSeed`，确保当前赛季赛道数据字段完整。
3. 更新数据库 seed，使 `npm run db:seed` 后数据库赛道数量与静态 seed 一致。
4. 更新 Jolpica 映射表，对无法从 Jolpica 获取历史结果的新赛道标记明确原因。
5. 更新 `/api/circuits` 的 `meta.count`、`meta.season` 和 `meta.source`，保证前端可准确显示数据来源。
6. 更新底部状态栏，使“已加载赛道数”来自实际 API 或 fallback 数据，而不是硬编码。
7. 更新 README 中的“当前能力”和数据库命令说明，避免文档与实际数据冲突。
8. 增加数据一致性测试，覆盖 seed、数据库映射、DTO 输出和状态栏展示。

---

### 2.5 验收标准

- 页面底部状态栏显示的赛道数量与 `/api/circuits` 返回数量一致。
- `circuitSeed` 的赛道数量与数据库 seed 后的 `circuits` 数量一致。
- README、开发文档和页面展示中的当前赛季站数一致。
- 没有历史结果的新赛道显示明确空状态，而不是错误状态。
- API 返回中能区分 `database`、`static-seed`、`jolpica`、`openf1`、`deepseek` 等来源。
- 所有数据一致性测试通过。

---

### 2.6 测试与验证

```text
npm test
npm run build
npm run db:migrate
npm run db:seed
npm run db:import:history
npm run db:verify
```

建议新增测试：

```text
circuitSeed 当前赛季数量与预期一致
每条 circuitSeed 都包含经纬度、赛道名称、大奖赛名称、国家、城市、长度、弯角、标签
Jolpica 映射表覆盖所有可映射赛道
无法映射历史结果的新赛道返回 empty 状态和明确 message
BottomStatusBar 展示的 count 来自 circuits.length
```

---

## 3. 拆分 App.jsx 业务状态

### 3.1 目标

将 `App.jsx` 从“业务状态集中容器”调整为“页面编排组件”。

拆分后，`App.jsx` 只负责组合 3D 地球、右侧抽屉和底部状态栏，不继续承载数据加载、Tab 资源缓存、选中赛道派生和聚焦逻辑。

---

### 3.2 当前问题

当前 `App.jsx` 同时负责：

1. 加载赛道列表。
2. 维护 `selectedCircuitId`。
3. 维护 `focusedCircuitId`。
4. 维护 `hoveredCircuitId`。
5. 控制右侧抽屉开关。
6. 控制当前抽屉 Tab。
7. 按需加载 history、calendar、AI insight。
8. 维护 `resourcesByCircuit` 缓存。
9. 维护全局数据源和连接状态。
10. 组装传给 `GlobeScene`、`CircuitDrawer`、`BottomStatusBar` 的 props。

这些职责目前还能工作，但后续一旦加入搜索、URL 分享、Tab 预取或更细错误状态，`App.jsx` 会继续膨胀。

---

### 3.3 拆分原则

拆分只改变状态边界，不改变用户可见交互。

拆分后的每个 hook 应满足：

1. 名称能表达职责。
2. 输入输出清晰。
3. 可单独测试。
4. 不直接操作 DOM。
5. 不依赖具体 UI 样式。
6. 不把 Serverless API 细节泄漏给展示组件。

---

### 3.4 目标结构

建议新增目录：

```text
src/features/app-state
├── useCircuitsResource.js
├── useSelectedCircuit.js
├── useCircuitTabResources.js
└── useGlobeSelection.js
```

职责划分：

```text
useCircuitsResource
负责加载赛道列表、处理 database/static fallback、输出 circuits 与 dataState。

useSelectedCircuit
负责 selectedCircuitId、drawerOpen、activeDrawerTab、selectedCircuit 派生。

useCircuitTabResources
负责 history、calendar、aiInsight 的按需加载、缓存、错误状态和 meta 更新。

useGlobeSelection
负责 focusedCircuitId、hoveredCircuitId、用户拖动地球后的自动聚焦取消。
```

---

### 3.5 App.jsx 目标职责

拆分后，`App.jsx` 应只保留以下职责：

1. 调用业务 hooks。
2. 渲染品牌标识。
3. 渲染 `GlobeScene`。
4. 渲染 `CircuitDrawer`。
5. 渲染 `BottomStatusBar`。
6. 连接组件事件与 hook 暴露的 action。

示意：

```jsx
function App() {
  const circuitsResource = useCircuitsResource()
  const selection = useSelectedCircuit(circuitsResource.circuits)
  const globeSelection = useGlobeSelection(selection.selectedCircuitId)
  const tabResources = useCircuitTabResources(selection.selectedCircuitId, selection.activeDrawerTab)

  return (
    <main className="appShell">
      ...
    </main>
  )
}
```

---

### 3.6 任务

1. 为当前 `App.jsx` 状态画出职责分组。
2. 创建 `src/features/app-state` 目录。
3. 抽出 `useCircuitsResource`。
4. 抽出 `useSelectedCircuit`。
5. 抽出 `useCircuitTabResources`。
6. 抽出 `useGlobeSelection`。
7. 保持 `GlobeScene`、`CircuitDrawer`、`BottomStatusBar` 的 props 语义不变。
8. 为每个 hook 增加单元测试。
9. 保留现有页面交互行为，不引入视觉变化。

---

### 3.7 验收标准

- `App.jsx` 不再直接包含 API 请求逻辑。
- `App.jsx` 不再直接维护 `resourcesByCircuit`。
- 赛道点击后仍然会选中 Marker、聚焦地球、打开右侧抽屉并回到概览 Tab。
- 切换 History、Calendar、AI 解读 Tab 仍然按需加载数据。
- API 失败时仍然展示错误状态，页面不崩溃。
- 现有测试全部通过。
- 新增 hook 测试覆盖 ready、fallback、empty、error、loading 等关键状态。

---

### 3.8 测试与验证

```text
npm test
npm run lint
npm run build
```

建议新增测试：

```text
useCircuitsResource API 成功时使用 database 数据
useCircuitsResource API 失败时回退 static seed
useSelectedCircuit 选择新赛道后重置 active tab 为 overview
useCircuitTabResources 对同一赛道同一 tab 不重复请求 ready 数据
useCircuitTabResources 请求失败时写入 error model
useGlobeSelection 用户开始拖动后取消自动聚焦
```

---

## 4. AI 解读升级为赛道工程分析

### 4.1 目标

将 AI 解读从“通用中文介绍”升级为“赛道工程分析”。

新的 AI 输出应更像 F1 工程师视角下的赛道分析，突出赛车调校、轮胎压力、刹车负荷、空气动力效率、超车难度、安全车概率、策略窗口和车手要求。

---

### 4.2 当前基础

当前项目已经具备：

1. DeepSeek 客户端。
2. 后端 Prompt 组装。
3. JSON 输出校验。
4. `ai_insights` 数据库缓存。
5. AI 生成接口。
6. 前端 AI 解读 Tab。
7. 生成中、失败和缓存命中状态。

第二阶段应复用这些基础，不新增聊天式 AI，不让前端直接访问 DeepSeek。

---

### 4.3 输出结构

建议将 AI 输出 schema 从基础解读升级为以下结构：

```json
{
  "summary": "整体工程判断，80 字以内",
  "trackFeature": "赛道结构特点，100 字以内",
  "carSetup": "赛车调校重点，100 字以内",
  "tyreAndBrakeLoad": "轮胎与刹车负荷，100 字以内",
  "overtakingAndRacePace": "超车难度与比赛节奏，100 字以内",
  "driverRequirement": "车手能力要求，100 字以内",
  "strategyRisk": "进站、安全车、天气或赛道位置风险，100 字以内",
  "dataConfidence": "高 / 中 / 低",
  "dataNotes": "说明哪些判断来自真实数据，哪些是基于赛道属性的推断"
}
```

---

### 4.4 Prompt 规则

Prompt 必须继续保持强约束：

1. 必须输出合法 JSON。
2. 不输出 Markdown。
3. 不编造输入数据中不存在的冠军、年份、纪录或赛历日期。
4. 区分事实、历史数据和工程推断。
5. 如果历史数据为空，必须降低 `dataConfidence`。
6. 不使用夸张营销语言。
7. 输出语言为中文。

---

### 4.5 后端任务

1. 扩展 `server/services/aiInsightService.js` 中的 `insightFields`。
2. 更新 `buildAiInsightPrompt`，加入工程分析 schema。
3. 更新 `parseAndValidateAiInsight`，校验新增字段。
4. 更新 `ai_insights` 缓存内容兼容策略。
5. 必要时增加 `insightType` 版本，例如 `track_engineering_v1`。
6. 保持旧缓存不会导致接口崩溃。
7. 更新 AI service 单元测试。

---

### 4.6 前端任务

1. 更新 `CircuitAiTab` 的展示结构。
2. 将 AI 解读分为“工程摘要”“调校重点”“轮胎与刹车”“超车与节奏”“策略风险”“数据可信度”。
3. 对 `dataConfidence` 使用克制的文本或小型状态标签展示。
4. 对 `dataNotes` 使用低优先级说明文字展示。
5. 生成失败时保留当前 ErrorState。
6. 缓存命中时展示模型名、生成时间和缓存状态。

---

### 4.7 交互规则

AI 解读 Tab 应保持当前右侧抽屉的紧凑数据风格。

```text
不使用大段聊天气泡
不使用对话输入框
不使用营销式长文案
不新增独立 AI 页面
不让 AI 面板压过地球主视觉
```

AI 生成按钮仅负责生成当前赛道的工程分析。重复点击同一赛道时，应优先读取缓存。

---

### 4.8 验收标准

- AI 接口返回新的赛道工程分析 schema。
- DeepSeek 返回非法 JSON 时仍然返回明确错误。
- DeepSeek 缺少字段时仍然返回明确错误。
- 没有历史数据的新赛道不会生成伪造历史结论。
- 前端 AI Tab 能完整展示新增字段。
- 旧缓存或空缓存不会导致页面崩溃。
- 同一赛道重复生成时优先读取缓存。
- DeepSeek API key 不暴露在前端。

---

### 4.9 测试与验证

```text
npm test
npm run lint
npm run build
```

建议新增测试：

```text
buildAiInsightPrompt 包含工程分析 schema
parseAndValidateAiInsight 校验所有新增字段
parseAndValidateAiInsight 拒绝缺失 dataConfidence 的响应
generateInsight 命中缓存时不调用 DeepSeek
generateInsight 对无历史数据赛道传入 empty history
CircuitAiTab 能展示 tyreAndBrakeLoad、strategyRisk、dataConfidence、dataNotes
```

---

## 5. 第二阶段实施顺序

### 5.1 推荐顺序

```text
1. 数据一致性与可信度
2. 拆分 App.jsx 业务状态
3. AI 解读升级为赛道工程分析
```

推荐先做数据一致性，是因为后续 AI 工程分析依赖可信输入。若赛道数量、赛历或历史数据口径不稳定，AI 输出即使结构正确，也会显得不可靠。

第二步拆分 `App.jsx`，是为了在升级 AI Tab 前先降低前端状态复杂度。

第三步升级 AI 解读，因为它同时依赖稳定数据与清晰前端状态边界。

---

### 5.2 第二阶段最终验收

第二阶段完成后，应满足：

1. 项目数据口径统一，页面、API、数据库和文档没有明显冲突。
2. `App.jsx` 成为轻量页面编排组件。
3. 赛道 Tab 资源加载逻辑具备清晰边界。
4. AI 解读具备“赛道工程分析”特征，而不是普通介绍文案。
5. 所有新增逻辑具备测试覆盖。
6. `npm test`、`npm run lint`、`npm run build` 全部通过。

---

## 6. 参考依据

```text
docs/F1_Globe_Explorer_SPA_Document.md
FrontDesign/screen.png
FrontDesign/DESIGN.md
src/App.jsx
server/services/aiInsightService.js
server/services/circuitService.js
```

外部赛历参考：

```text
Formula 1 2026 calendar: https://www.formula1.com/en/racing/2026/
FIA 2026 calendar announcement: https://www.fia.com/news/fia-and-formula-1-announce-2026-calendar
```
