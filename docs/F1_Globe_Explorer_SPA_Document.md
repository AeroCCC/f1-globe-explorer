# F1 Globe Explorer 单页面需求与开发文档

> 项目定位：一个以 3D 地球为核心视觉入口的 Formula 1 全球赛道数据探索 Web 应用。
> 页面形态：单页面应用，不设置传统顶部导航栏，不设置左侧浮动面板，仅保留 3D 主视觉、右侧动态侧边栏与底部状态栏。
> 技术方案：React + Vite + React Three Fiber 前端，Node Serverless API 后端，Postgres 数据库，DeepSeek 生成中文 AI 赛道解读。
> 当前开发边界：仅覆盖 Web 桌面端产品体验。

---

## 1. 项目概述

### 1.1 项目名称

**F1 Globe Explorer**

中文名称：

**F1 全球赛道探索器**

完整项目标题：

**F1 Globe Explorer：基于 3D 地球的 F1 全球赛道数据可视化单页面应用**

---

### 1.2 项目背景

传统 F1 数据网站通常以表格、列表和多页面跳转为主，用户在查看赛道信息、赛历、历史数据时，缺少空间感和沉浸感。

本项目希望以 3D 地球作为主视觉，将全球 F1 赛道点位直观地展示在地球表面。用户不需要通过复杂菜单跳转，而是直接点击地球上的赛道点位，在右侧动态侧边栏中完成赛道信息浏览、历史数据查看、赛历查询与 AI 解读。

当前项目已经具备 React + Vite + React Three Fiber 的 3D 地球基础，后续开发应在现有实现上继续推进，不重建前端工程。

---

### 1.3 项目目标

1. 构建一个高完成度的 3D 地球交互页面。
2. 在地球表面展示全球 F1 赛道点位。
3. 用户点击赛道后，右侧动态侧边栏弹出。
4. 侧边栏内部集成赛道概览、历史数据、赛历信息、AI 解读等功能。
5. 底部状态栏展示当前赛季、已加载赛道数、当前选中赛道、数据源与连接状态。
6. 后端通过 Serverless API 聚合赛道基础数据、Jolpica F1、OpenF1 与 DeepSeek。
7. 避免传统多页面跳转，形成沉浸式单页面数据探索体验。

---

## 2. 产品定位

### 2.1 产品一句话描述

**F1 Globe Explorer 是一个基于 3D 地球的 F1 全球赛道数据可视化单页面应用，用户可以点击地球上的赛道点位，在右侧动态侧边栏中查看赛道概览、历史数据、赛历信息与中文 AI 解读。**

---

### 2.2 适合写进简历的描述

F1 Globe Explorer 是一个基于 React、Vite、React Three Fiber 与 Node Serverless API 的 Formula 1 全球赛道数据可视化应用。项目以 3D 地球作为核心交互场景，将全球 F1 赛道以地理点位形式映射到地球表面。用户点击赛道后，右侧动态侧边栏自动展开，集中展示赛道概览、历史比赛数据、赛历信息和 DeepSeek 生成的中文赛道解读。项目通过状态驱动的单页面交互替代传统多页面跳转，提升了数据浏览的沉浸感和作品集展示效果。

---

## 3. 页面布局设计

### 3.1 总体布局原则

本项目采用极简沉浸式布局：

- 不设置传统顶部导航栏。
- 不设置左侧浮动面板。
- 主视觉区域尽可能留给 3D 地球。
- 右侧动态侧边栏只在用户点击赛道后出现。
- 底部状态栏始终显示，用于展示全局状态信息。
- 当前版本只验收桌面 Web 布局。

---

### 3.2 页面区域划分

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      主视觉区域                              │
│                  3D 地球 + 赛道点位                          │
│                                                             │
│                                      ┌──────────────────┐   │
│                                      │ 右侧动态侧边栏     │   │
│                                      │ 点击赛道后弹出     │   │
│                                      │ 集成所有功能       │   │
│                                      └──────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 底部状态栏：当前赛季｜已加载赛道｜当前选中｜数据源｜连接状态     │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 主视觉区域

主视觉区域占据页面绝大部分空间。

主要内容：

1. 3D 地球模型。
2. 全球 F1 赛道点位。
3. 当前选中赛道的高亮效果。
4. 鼠标悬浮赛道时显示简短 Tooltip。
5. 点击赛道后打开右侧动态侧边栏。
6. 地球支持拖拽旋转、滚轮缩放、选中赛道后自动聚焦。

视觉建议：

- 深色宇宙背景。
- 地球带轻微蓝色大气光晕。
- 普通赛道点位使用红白微光。
- 选中赛道点位使用更强的红色呼吸光圈。
- 主视觉区不堆叠大量按钮、菜单和解释文案。

---

### 3.4 右侧动态侧边栏

右侧动态侧边栏是本项目的信息与功能中心。

出现条件：

- 默认隐藏。
- 用户点击某个赛道点位后弹出。
- 用户点击关闭按钮后收起。
- 用户切换赛道时，侧边栏内容自动刷新。

宽度建议：

- 桌面端：页面宽度的 28% 到 34%。
- 最小宽度：360px。
- 最大宽度：520px。
- 当前版本不设计小屏替代形态。

侧边栏内部模块：

1. 赛道头部信息。
2. 赛道基础信息卡片。
3. 内部标签页。
4. 概览模块。
5. 历史数据模块。
6. 赛历信息模块。
7. AI 解读模块。
8. 操作按钮区。

---

### 3.5 底部状态栏

底部状态栏始终显示，用于提供全局状态信息。

建议字段：

```text
当前赛季：2026
已加载赛道：24
当前选中：Singapore GP
数据源：Jolpica / OpenF1 / DeepSeek
状态：已连接
```

设计建议：

- 高度 52px 到 64px。
- 半透明深色背景。
- 文字简洁。
- 图标辅助识别。
- 当前选中赛道用红色强调。
- 连接状态用绿色圆点表示。

---

### 3.6 Stitch 初稿视觉基准

#### 基准来源

后续前端实现必须严格对齐已确认的 Stitch 初稿，不再重新发散视觉方向。

```text
Stitch Project: F1 Globe Explorer
Project ID: 3221145910031340012
Screen: F1 Globe Explorer - Desktop App
Screen ID: 6c82bbd71c744b9ab19c427650624d46
```

当前仓库已保存该初稿导出文件，后续实现以这些文件为最高优先级视觉依据：

```text
FrontDesign/screen.png   最终桌面视觉截图，作为像素级观感基准
FrontDesign/DESIGN.md    Apex Precision 设计系统，作为颜色、字体、间距、组件规则基准
FrontDesign/code.html    Stitch 生成的结构与样式参考，作为布局拆解基准
```

如果本章节文字描述与 `FrontDesign` 文件存在差异，以 `FrontDesign/screen.png` 和 `FrontDesign/DESIGN.md` 为准。

该初稿的核心判断是：页面不是营销首页，也不是传统仪表盘，而是一个以真实 3D 地球为中心的 F1 数据探索应用。

#### 视觉风格

整体风格采用“高级赛车数据驾驶舱”：

- 以现有真实 3D 地球模型为主视觉。
- 保留深色宇宙背景、蓝色大气光晕、云层和星空。
- UI 叠加层使用近黑玻璃面板、白色文字、细灰色分割线和克制 F1 红。
- 风格参考 Ferrari editorial racing 与 BMW M engineering UI。
- 界面应显得精密、克制、技术化、具备赛车运动气质。

避免以下方向：

- 不做普通 SaaS dashboard。
- 不做 marketing landing page。
- 不做大标题 hero 文案覆盖地球。
- 不做左侧侧边栏。
- 不做顶部传统导航菜单。
- 不使用 emoji 图标。
- 不使用花哨大面积渐变、卡片瀑布流、bento grid 或圆润气泡式 UI。

#### 视觉层级

页面视觉优先级固定为：

```text
1. 3D Earth
2. selected circuit marker
3. right circuit drawer
4. bottom status bar
5. brand mark
```

任何新增 UI 都不得压过 3D 地球。右侧栏与底部栏只能作为数据叠加层存在。

#### 桌面布局

桌面端设计尺寸以 `1440x900` 为主要参考。

```text
┌─────────────────────────────────────────────────────────────┐
│  F1 Globe Explorer                                           │
│                                                             │
│             realistic 3D Earth + F1 circuit markers          │
│                                                             │
│                                      ┌──────────────────┐   │
│                                      │ Circuit Drawer    │   │
│                                      │ Overview / tabs   │   │
│                                      │ circuit metrics   │   │
│                                      └──────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Season | Circuits | Selected | Data source | Connected       │
└─────────────────────────────────────────────────────────────┘
```

桌面端右侧动态侧边栏：

- 宽度约 420px。
- 贴近右侧，垂直方向避开底部状态栏。
- 背景使用暗色半透明玻璃态。
- 顶部有红色细线或小面积红色强调。
- 圆角不超过 8px。
- 不使用重阴影。

#### 桌面端产品边界

当前版本只实现和验收 Web 桌面端体验，以 `1440x900` 为主要参考。

- 地球始终是第一视觉主体。
- 右侧栏保持桌面端右侧动态侧边栏形态。
- 底部状态栏保持单行紧凑信息。
- 不增加小屏替代布局。

#### 色彩规范

```text
pageBackground: #050914
drawerSurface: rgba(10, 12, 18, 0.72)
primaryText: #F7FBFF
secondaryText: #9AA4B2
hairline: rgba(255, 255, 255, 0.12)
f1Red: #E10600 或 #FF2F45
atmosphereBlue: #5AB8FF
successGreen: #19C37D
```

使用原则：

- 红色只用于选中赛道、主动标签、关键 F1 高亮和主要动作。
- 蓝色只用于地球大气、空间氛围和轻量辅助光效。
- 灰色细线用于信息分组。
- 不引入额外品牌色。

#### 字体与排版

- 使用 Inter、Geist 或现代几何无衬线字体。
- 标题使用 500 或 600 字重，不使用过粗字重。
- 正文使用 14px 到 16px。
- 技术标签、数据源、接口状态可使用等宽字体。
- 正文不使用全大写。
- 小标签和 Tab 可以使用全大写，但字距要克制。

#### 赛道 Marker

普通 Marker：

- 小型红白发光点。
- 贴合地球表面。
- 不做大图标，不遮挡地球纹理。

选中 Marker：

- 红色亮点。
- 外层呼吸光圈。
- 明显区别于普通点位。

悬浮 Tooltip：

```text
Marina Bay Street Circuit
Singapore Grand Prix
```

Tooltip 应紧凑、暗底、细边框，不使用大卡片。

#### 右侧动态侧边栏内容

初稿默认展示“已选中 Marina Bay Street Circuit”的状态。后续实现也应优先完成选中态，而不是空状态。

侧边栏头部：

```text
Marina Bay Street Circuit
Singapore Grand Prix
Country: Singapore
```

基础数据：

```text
Track type: Street Circuit
Length: 5.063 km
Turns: 19
First Grand Prix: 2008
Current season: Confirmed
Tags: Night Race, Street Circuit, High Humidity, Low Overtaking
```

内部标签页：

```text
Overview
History
Calendar
AI Insight
```

Overview 默认内容：

```text
A demanding night street circuit where precision, braking stability, and thermal management define race pace.
```

关键特征：

```text
Low-speed traction
Safety car probability
High physical demand
```

操作按钮：

```text
View history
Generate AI insight
```

内容组织原则：

- 使用紧凑数据行，不使用大块卡片堆叠。
- 允许少量小型信息块，但不允许卡片套卡片。
- 信息优先，装饰克制。

#### 底部状态栏

底部状态栏固定显示，高度约 56px。

内容：

```text
Season: 2026
Circuits loaded: 24
Selected: Singapore GP
Data: Jolpica / OpenF1
Status: Connected
```

设计规则：

- 暗色半透明背景。
- 顶部 1px 细边框。
- 状态绿点表示 connected。
- 当前选中赛道可以用红色强调。
- 不使用大按钮。

#### 交互状态

初稿需要体现以下状态，后续实现必须覆盖：

- 已选中赛道 Marker。
- 右侧侧边栏已打开。
- Overview Tab 处于 active。
- 底部状态栏反映当前选中赛道。
- 按钮和标签具备 hover / pressed / focus 可扩展状态。

#### Stitch 复现提示词

如果需要继续在 Stitch 中迭代，应使用以下提示词作为基准，避免生成结果跑偏：

```text
Create a high-fidelity frontend preview for a single-page web app called “F1 Globe Explorer”.

Product:
A Formula 1 global circuit explorer built around a realistic interactive 3D Earth. The user explores F1 circuits by rotating a globe, clicking circuit markers, and reading circuit data in a dynamic right-side drawer.

Current visual foundation:
The page already has a complete 3D Earth model. Preserve this style:
- Full-screen dark space background.
- Realistic textured Earth with cloud layer.
- Subtle blue atmospheric glow around the planet.
- Small star field in the background.
- The Earth is the primary visual object, not a decorative illustration.
- The interface should feel like premium motorsport telemetry layered over a cinematic globe.

Design direction:
Premium F1 motorsport interface, inspired by Ferrari editorial racing and BMW M engineering UI.
Use a near-black canvas, white typography, subtle grey hairlines, and very restrained racing red accents.
The UI should feel precise, cinematic, technical, and portfolio-ready.
Avoid generic SaaS dashboard styling.
Avoid colorful gradients, bento cards, rounded bubbly UI, emojis, cartoon icons, and marketing landing-page sections.

Layout:
Single screen app, not a landing page.
No traditional top navigation bar.
No left sidebar.
Main area is a full-bleed 3D Earth canvas.
Add only lightweight overlay UI:
1. Minimal brand mark in the top-left:
   - “F1 Globe Explorer”
   - small geometric globe/racing mark
   - compact, white, understated
2. Right dynamic drawer, visible in the preview as if a circuit is selected.
3. Bottom status bar always visible.

Main Earth area:
- Show a large realistic Earth occupying most of the viewport.
- Add red/white glowing circuit markers on the globe surface.
- Selected marker should have a stronger red pulse ring.
- Add a small hover-style tooltip near one marker:
  “Marina Bay Street Circuit”
  “Singapore Grand Prix”
- Do not cover the Earth with large panels.
- The Earth should still feel draggable and zoomable.

Right drawer:
Position on the right side, width around 420px on desktop.
Use dark translucent glass surface:
- background: rgba(10, 12, 18, 0.72)
- backdrop blur
- 1px subtle border rgba(255,255,255,0.12)
- sharp or small-radius corners, max 8px
- no heavy shadow
- red accent line near the top

Drawer content selected circuit:
Header:
- “Marina Bay Street Circuit”
- “Singapore Grand Prix”
- Country: Singapore
- Close icon button

Info summary:
- Track type: Street Circuit
- Length: 5.063 km
- Turns: 19
- First Grand Prix: 2008
- Current season: Confirmed
- Tags: Night Race, Street Circuit, High Humidity, Low Overtaking

Tabs inside drawer:
- Overview
- History
- Calendar
- AI Insight

Show Overview tab active.
Use compact data rows, not big cards.
Use red only for active tab, selected marker, and important F1 highlights.

Bottom status bar:
Fixed at bottom, height around 56px.
Dark translucent background with thin top border.
Content:
- Season: 2026
- Circuits loaded: 24
- Selected: Singapore GP
- Data: Jolpica / OpenF1
- Status: Connected with green dot
Keep this bar compact and readable.

Typography:
Use Inter, Geist, or a modern geometric sans-serif.
Headings: 500 or 600 weight, never overly bold.
Body: 14–16px.
Small technical labels can use a mono font.
Use uppercase only for small labels and tabs, not for all body text.
Maintain strong contrast on dark background.

Colors:
- Page background: #050914 or near-black
- Drawer surface: rgba(10, 12, 18, 0.72)
- Main text: #F7FBFF
- Secondary text: #9AA4B2
- Hairline: rgba(255,255,255,0.12)
- F1 red accent: #E10600 or #FF2F45
- Atmosphere blue: #5AB8FF
- Success green: #19C37D
Use red sparingly. Do not make the whole UI red.

Interaction states to show visually:
- Selected circuit marker has red glow.
- Active tab has red underline or red left edge.
- Buttons have subtle border and hover-ready state.
- Drawer is open because a circuit is selected.
- Bottom status bar reflects selected circuit.

Desktop behavior:
- Earth remains the first visual priority.
- Drawer remains a right-side overlay panel.
- Bottom status bar remains a compact single-row strip.
- Do not add alternate small-screen layouts in the current version.

Important constraints:
- Do not create a marketing homepage.
- Do not add hero text blocks over the Earth.
- Do not add pricing sections, testimonials, feature grids, or CTA bands.
- Do not use emoji icons.
- Do not use a left sidebar.
- Do not make the UI look like a generic admin dashboard.
- The first screen must be the actual product experience: 3D Earth + F1 markers + selected circuit drawer + bottom status bar.

Output:
Generate a polished desktop app screen at 1440x900.
Prioritize realistic spacing, strong contrast, premium motorsport mood, and implementation-friendly React components.
```

---

## 4. 功能文档

## 4.1 功能模块总览

```text
F1 Globe Explorer
├── 主视觉 3D 地球模块
├── 赛道点位模块
├── 赛道点击与选中模块
├── 右侧动态侧边栏模块
│   ├── 赛道概览
│   ├── 历史数据
│   ├── 赛历信息
│   └── AI 解读
├── 底部状态栏模块
├── Serverless 数据接口模块
├── Postgres 缓存与持久化模块
└── DeepSeek AI 分析模块
```

---

## 4.2 3D 地球模块

### 功能说明

展示一个可交互的 3D 地球模型，作为整个应用的主视觉和主要交互入口。

### 功能点

1. 地球贴图显示。
2. 鼠标拖拽旋转。
3. 滚轮缩放。
4. 云层轻微自动运动。
5. 点击赛道后自动聚焦到对应经纬度。
6. 支持重置视角，可通过快捷键或底部状态栏隐藏入口实现。

### 验收标准

- 页面加载后可以看到完整地球。
- 地球可以旋转和缩放。
- 地球不会遮挡底部状态栏。
- 选中赛道后视角能平滑移动。

---

## 4.3 赛道点位模块

### 功能说明

将全球 F1 赛道按照经纬度映射到 3D 地球表面。

### 点位数据字段

```ts
type Circuit = {
  circuitId: string
  name: string
  chineseName?: string
  grandPrixName: string
  country: string
  city: string
  region: string
  latitude: number
  longitude: number
  trackType: 'Street Circuit' | 'Permanent Circuit' | 'Hybrid Circuit'
  lengthKm?: number
  turns?: number
  firstGrandPrix?: number
  isCurrentSeason: boolean
  tags: string[]
}
```

### 功能点

1. 根据经纬度渲染赛道 Marker。
2. 普通 Marker 显示基础发光效果。
3. 当前选中 Marker 显示高亮光圈。
4. 鼠标悬浮 Marker 显示 Tooltip。
5. 点击 Marker 更新当前选中赛道。
6. 点击 Marker 打开右侧动态侧边栏。

### 验收标准

- 赛道 Marker 能正确贴合地球表面。
- 点击 Marker 后能正确选中赛道。
- 当前选中 Marker 有明显视觉反馈。
- Tooltip 显示赛道名称和大奖赛名称。

---

## 4.4 右侧动态侧边栏模块

### 功能说明

右侧动态侧边栏是所有详细功能的承载区域。用户点击赛道后，侧边栏展开，并展示该赛道的相关信息。

### 侧边栏结构

```text
右侧动态侧边栏
├── 顶部：赛道名称、大奖赛名称、关闭按钮
├── 基础信息区
├── 内部标签栏
│   ├── 概览
│   ├── 历史数据
│   ├── 赛历信息
│   └── AI 解读
├── 当前标签内容区
└── 底部操作按钮
```

---

## 4.5 赛道概览功能

### 展示内容

1. 赛道名称。
2. 大奖赛名称。
3. 国家。
4. 城市。
5. 赛道类型。
6. 赛道长度。
7. 弯道数量。
8. 首次举办年份。
9. 当前赛季状态。
10. 赛道标签。
11. 关键数据摘要。
12. 简短 AI 摘要。

### 示例

```text
Marina Bay Street Circuit
新加坡大奖赛

国家：新加坡
城市：新加坡
赛道类型：街道赛道
长度：5.063 km
弯道数：19
首次举办：2008
当前赛季状态：已确认（2026 赛历）

标签：夜赛｜街道赛道｜高温高湿｜超车困难
```

---

## 4.6 历史数据功能

### 功能说明

展示当前赛道的历史比赛结果和车队/车手表现。

### 展示内容

1. 近五年冠军。
2. 历年冠军列表。
3. 车队胜场统计。
4. 车手胜场统计。
5. 排位与正赛结果关系。
6. 关键纪录，例如最快圈、最多胜场、杆位次数。

### 图表建议

1. 近五年冠军柱状图。
2. 车队胜场横向柱状图。
3. 车手胜场排行。
4. 排位与正赛结果对比表。

---

## 4.7 赛历信息功能

### 功能说明

展示该赛道在当前赛季中的比赛安排。

### 展示内容

1. 当前赛季年份。
2. 分站轮次。
3. 比赛周日期。
4. 正赛日期。
5. 举办国家。
6. 举办城市。
7. 赛道名称。
8. 比赛状态：未开始、进行中、已结束。
9. 如果比赛已结束，展示冠军和车队。

### 示例

```text
2026 赛季
Round 16
Singapore Grand Prix
日期：2026-10-09 至 2026-10-11
地点：Singapore
状态：未开始
```

---

## 4.8 AI 解读功能

### 功能说明

AI 解读功能基于赛道基础数据、历史比赛数据和赛历信息，由 DeepSeek 生成中文赛道分析。

### AI 解读内容

1. 赛道整体特点。
2. 对赛车调校的要求。
3. 对车手能力的要求。
4. 对排位赛的影响。
5. 对进站策略的影响。
6. 对比赛观赏性的说明。

### AI Prompt 模板

```text
你是一名 Formula 1 数据分析助手。请根据以下赛道结构化数据，生成一段中文赛道分析。

要求：
1. 先总结赛道类型和驾驶特点。
2. 分析该赛道对赛车调校的要求。
3. 分析该赛道对车手能力的要求。
4. 分析排位赛、进站策略、安全车可能带来的影响。
5. 语言专业但通俗，适合作品集展示。
6. 不要编造输入数据中不存在的具体冠军、年份或纪录。
7. 返回严格 JSON，不要输出 Markdown。

赛道数据：
{{circuitData}}

历史数据：
{{raceHistory}}

赛历信息：
{{calendarData}}
```

### AI 输出结构

```json
{
  "summary": "新加坡滨海湾街道赛道是一条典型的低速街道赛道...",
  "trackFeature": "弯道密集，直道较短...",
  "carSetup": "更强调机械抓地力、刹车稳定性和低速牵引...",
  "driverRequirement": "对专注力、体能和贴墙驾驶精度要求较高...",
  "strategyImpact": "安全车和进站窗口对比赛影响较大..."
}
```

---

## 5. 交互流程

## 5.1 页面加载流程

```text
用户打开网站
  ↓
加载 3D 地球
  ↓
请求 /api/circuits
  ↓
在地球上渲染赛道点位
  ↓
底部状态栏显示当前赛季、赛道数量、数据源状态
```

---

## 5.2 点击赛道流程

```text
用户点击地球上的赛道 Marker
  ↓
React Three Fiber pointer event 获取 circuitId
  ↓
设置 selectedCircuitId
  ↓
地球视角聚焦到该赛道
  ↓
打开右侧动态侧边栏
  ↓
默认展示“概览”标签
  ↓
按需加载赛道详情数据
```

---

## 5.3 切换侧边栏标签流程

```text
用户点击侧边栏内部标签
  ↓
更新 activeDrawerTab
  ↓
如果数据未加载，则请求对应 Serverless API
  ↓
显示 Loading 状态
  ↓
接口返回后展示内容
  ↓
失败时展示 Error 状态与重试入口
```

---

## 5.4 AI 解读流程

```text
用户打开 AI 解读标签
  ↓
请求 GET /api/circuits/:circuitId/ai-insight
  ↓
如果已有缓存，直接展示
  ↓
如果没有缓存，显示“生成 AI 分析”按钮
  ↓
用户点击生成
  ↓
POST /api/circuits/:circuitId/ai-insight
  ↓
后端组装赛道数据、历史数据和赛历信息
  ↓
调用 DeepSeek
  ↓
返回结构化 JSON 分析结果
  ↓
写入 Postgres 缓存
  ↓
前端展示 AI 解读内容
```

---

## 6. 技术实现方案

## 6.1 推荐技术栈

### 前端

```text
React
Vite
JavaScript / TypeScript
Three.js
@react-three/fiber
@react-three/drei
Vitest
CSS Modules 或普通 CSS
```

### 后端

```text
Node Serverless API
Postgres
fetch / undici
环境变量管理
```

### 数据与 AI

```text
Jolpica F1 API：历史赛季、赛历、比赛结果
OpenF1 API：2023 年以来的会话、天气、位置和遥测数据
DeepSeek：中文 AI 赛道解读
```

### 环境变量

```text
DATABASE_URL
DEEPSEEK_API_KEY
DEEPSEEK_MODEL=deepseek-chat
JOLPICA_BASE_URL=https://api.jolpi.ca/ergast/f1
OPENF1_BASE_URL=https://api.openf1.org/v1
```

---

## 6.2 前端目录结构

当前项目保留 React + Vite 工程，在现有 `src/globe` 基础上扩展功能。

```text
src
├── App.jsx
├── App.css
├── main.jsx
│
├── globe
│   ├── GlobeScene.jsx
│   ├── GlobeMarker.jsx
│   ├── GlobeTooltip.jsx
│   ├── geo.js
│   ├── globeConfig.js
│   └── globeConfig.test.js
│
├── features
│   ├── circuits
│   │   ├── circuitTypes.js
│   │   ├── circuitSeed.js
│   │   ├── circuitApi.js
│   │   └── circuitSelectors.js
│   │
│   ├── drawer
│   │   ├── CircuitDrawer.jsx
│   │   ├── DrawerTabs.jsx
│   │   ├── CircuitOverviewTab.jsx
│   │   ├── CircuitHistoryTab.jsx
│   │   ├── CircuitCalendarTab.jsx
│   │   └── CircuitAiTab.jsx
│   │
│   ├── status
│   │   └── BottomStatusBar.jsx
│   │
│   └── common
│       ├── LoadingState.jsx
│       ├── EmptyState.jsx
│       └── ErrorState.jsx
│
├── api
│   ├── circuitsClient.js
│   ├── historyClient.js
│   ├── calendarClient.js
│   └── aiClient.js
│
└── utils
    ├── date.js
    └── format.js
```

---

## 6.3 Serverless 后端目录结构

```text
api
├── circuits
│   ├── index.js
│   └── [circuitId].js
│
├── circuit-history
│   └── [circuitId].js
│
├── circuit-calendar
│   └── [circuitId].js
│
└── circuit-ai-insight
    └── [circuitId].js

server
├── db
│   ├── client.js
│   └── migrations
│       └── 001_init.sql
│
├── clients
│   ├── jolpicaClient.js
│   ├── openF1Client.js
│   └── deepseekClient.js
│
├── repositories
│   ├── circuitRepository.js
│   ├── raceRepository.js
│   └── aiInsightRepository.js
│
└── services
    ├── circuitService.js
    ├── historyService.js
    ├── calendarService.js
    └── aiInsightService.js
```

---

## 6.4 前端状态设计

前端使用 React 本地状态即可完成第一版，不强制引入全局状态库。

### App 状态

```ts
type DrawerTab = 'overview' | 'history' | 'calendar' | 'ai'

type AppState = {
  circuits: Circuit[]
  selectedCircuitId: string | null
  activeDrawerTab: DrawerTab
  drawerOpen: boolean
  dataStatus: 'idle' | 'loading' | 'ready' | 'error'
}
```

### 核心状态流

```text
App
├── 加载 circuits
├── 管理 selectedCircuitId
├── 管理 drawerOpen 与 activeDrawerTab
├── 将 circuits 传给 GlobeScene
└── 将 selectedCircuit 传给 CircuitDrawer 与 BottomStatusBar
```

---

## 6.5 经纬度转 3D 坐标

```ts
export function latLngToVector3(lat: number, lng: number, radius = 2.05) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}
```

---

## 6.6 Marker 点击检测

React Three Fiber 中优先使用 mesh 事件，不手写全局 Raycaster。

```tsx
function GlobeMarker({ circuit, selected, onSelect }) {
  const position = latLngToVector3(circuit.latitude, circuit.longitude)

  return (
    <group position={position}>
      <mesh
        userData={{ circuitId: circuit.circuitId }}
        onPointerOver={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(circuit.circuitId)
        }}
      >
        <sphereGeometry args={[selected ? 0.045 : 0.032, 24, 24]} />
        <meshBasicMaterial color={selected ? '#ff2f45' : '#ffffff'} />
      </mesh>
    </group>
  )
}
```

---

## 6.7 侧边栏打开逻辑

```ts
function handleSelectCircuit(circuitId: string) {
  setSelectedCircuitId(circuitId)
  setActiveDrawerTab('overview')
  setDrawerOpen(true)
}
```

---

## 7. 数据库设计

数据库使用 Postgres。Serverless 层负责读写缓存、聚合外部 API 数据，并向前端返回稳定 DTO。

## 7.1 circuits 表

```sql
CREATE TABLE IF NOT EXISTS circuits (
  id BIGSERIAL PRIMARY KEY,
  circuit_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  chinese_name TEXT,
  grand_prix_name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  track_type TEXT NOT NULL,
  length_km NUMERIC(6, 3),
  turns INTEGER,
  first_grand_prix INTEGER,
  is_current_season BOOLEAN NOT NULL DEFAULT FALSE,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 7.2 races 表

```sql
CREATE TABLE IF NOT EXISTS races (
  id BIGSERIAL PRIMARY KEY,
  season INTEGER NOT NULL,
  round INTEGER NOT NULL,
  race_name TEXT NOT NULL,
  circuit_id TEXT NOT NULL REFERENCES circuits(circuit_id),
  race_date DATE,
  race_time TIME,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (season, round)
);
```

---

## 7.3 race_results 表

```sql
CREATE TABLE IF NOT EXISTS race_results (
  id BIGSERIAL PRIMARY KEY,
  season INTEGER NOT NULL,
  round INTEGER NOT NULL,
  circuit_id TEXT NOT NULL REFERENCES circuits(circuit_id),
  driver_id TEXT,
  driver_name TEXT,
  constructor_id TEXT,
  constructor_name TEXT,
  grid_position INTEGER,
  finish_position INTEGER,
  points NUMERIC(5, 2),
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 7.4 ai_insights 表

```sql
CREATE TABLE IF NOT EXISTS ai_insights (
  id BIGSERIAL PRIMARY KEY,
  circuit_id TEXT NOT NULL REFERENCES circuits(circuit_id),
  insight_type TEXT NOT NULL DEFAULT 'track_analysis',
  content JSONB NOT NULL,
  model_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (circuit_id, insight_type)
);
```

---

## 8. API 接口设计

## 8.1 获取全部赛道

```http
GET /api/circuits
```

返回示例：

```json
[
  {
    "circuitId": "marina_bay",
    "name": "Marina Bay Street Circuit",
    "chineseName": "滨海湾街道赛道",
    "grandPrixName": "Singapore Grand Prix",
    "country": "Singapore",
    "city": "Singapore",
    "region": "Asia",
    "latitude": 1.2914,
    "longitude": 103.864,
    "trackType": "Street Circuit",
    "lengthKm": 5.063,
    "turns": 19,
    "firstGrandPrix": 2008,
    "isCurrentSeason": true,
    "tags": ["night race", "street circuit", "high humidity"]
  }
]
```

---

## 8.2 获取赛道详情

```http
GET /api/circuits/:circuitId
```

---

## 8.3 获取赛道历史数据

```http
GET /api/circuits/:circuitId/history
```

返回内容：

```json
{
  "circuitId": "marina_bay",
  "recentWinners": [],
  "constructorWins": [],
  "driverWins": [],
  "records": []
}
```

---

## 8.4 获取赛道赛历信息

```http
GET /api/circuits/:circuitId/calendar?season=2026
```

返回内容：

```json
{
  "season": 2026,
  "round": 16,
  "raceName": "Singapore Grand Prix",
  "raceDate": "2026-10-11",
  "status": "scheduled"
}
```

---

## 8.5 获取 AI 解读

```http
GET /api/circuits/:circuitId/ai-insight
```

如果已有缓存，直接返回。

---

## 8.6 生成 AI 解读

```http
POST /api/circuits/:circuitId/ai-insight
```

首次生成时调用 DeepSeek，并将结构化结果写入 `ai_insights`。

---

## 9. 开发计划

## 9.1 第一阶段：产品壳改造

### 目标

基于当前 React 项目完成 F1 单页面基础布局。

### 任务

1. 将页面品牌从 `World News` 改为 `F1 Globe Explorer`。
2. 移除顶部栏的传统导航语义，只保留轻量品牌标识。
3. 创建底部状态栏组件。
4. 创建右侧动态侧边栏空壳。
5. 使用静态赛道数据测试侧边栏打开与关闭。

### 验收标准

- 页面没有传统顶部导航栏。
- 页面没有左侧浮动面板。
- 页面主体区域保留给 3D 地球。
- 右侧侧边栏可以通过状态打开与关闭。
- 底部状态栏固定显示。

---

## 9.2 第二阶段：赛道点位渲染

### 目标

在现有 3D 地球上显示全球 F1 赛道点位。

### 任务

1. 准备当前赛季赛道 seed 数据。
2. 定义 `Circuit` 数据结构。
3. 实现 `latLngToVector3`。
4. 创建 `GlobeMarker`。
5. 将 Marker 贴合到地球表面。
6. 实现 Marker 发光材质。
7. 实现选中 Marker 高亮效果。
8. 实现 Hover Tooltip。

### 验收标准

- 所有赛道点位能显示在地球表面。
- 赛道点位分布位置基本准确。
- 鼠标悬浮显示赛道名称和大奖赛名称。
- 选中点位有明显高亮效果。

---

## 9.3 第三阶段：点击赛道与侧边栏联动

### 目标

点击赛道后弹出右侧动态侧边栏。

### 任务

1. 使用 React Three Fiber pointer event 处理 Marker 点击。
2. 点击 Marker 获取 `circuitId`。
3. 更新 `selectedCircuitId` 状态。
4. 打开右侧动态侧边栏。
5. 默认展示“概览”标签。
6. 地球视角聚焦到选中赛道。
7. 底部状态栏更新当前选中赛道。

### 验收标准

- 点击赛道后，右侧侧边栏弹出。
- 侧边栏展示当前赛道信息。
- 底部状态栏显示当前选中赛道。
- 选中 Marker 高亮。

---

## 9.4 第四阶段：侧边栏内容模块

### 目标

完成右侧侧边栏的四个标签页。

### 任务

1. 创建概览标签页。
2. 创建历史数据标签页。
3. 创建赛历信息标签页。
4. 创建 AI 解读标签页。
5. 为每个标签页提供 Loading、Empty、Error 状态。
6. 概览页按钮可以切换到历史数据或 AI 解读。

### 验收标准

- 侧边栏概览信息完整。
- 标签页切换稳定。
- 空数据和失败状态不会导致页面崩溃。
- Web 桌面端侧边栏布局稳定。

---

## 9.5 第五阶段：Serverless API

### 目标

提供前端所需的后端接口。

### 任务

1. 创建 `/api/circuits`。
2. 创建 `/api/circuits/:circuitId`。
3. 创建 `/api/circuits/:circuitId/history`。
4. 创建 `/api/circuits/:circuitId/calendar`。
5. 创建 `/api/circuits/:circuitId/ai-insight`。
6. 封装 Jolpica F1 客户端。
7. 封装 OpenF1 客户端。
8. 统一 DTO 输出结构。

### 验收标准

- 前端可通过 `/api/circuits` 获取赛道列表。
- 赛道详情、历史数据、赛历信息接口可独立访问。
- 接口失败时返回明确错误结构。
- 前端不直接访问第三方 API。

---

## 9.6 第六阶段：Postgres 数据库与缓存

### 目标

引入 Postgres 持久化赛道、比赛结果和 AI 解读缓存。

### 任务

1. 创建数据库连接模块。
2. 创建 `circuits` 表。
3. 创建 `races` 表。
4. 创建 `race_results` 表。
5. 创建 `ai_insights` 表。
6. 编写 seed 脚本导入基础赛道数据。
7. AI 解读优先读取缓存。

### 验收标准

- 数据库迁移可以重复执行。
- seed 数据可导入。
- AI 解读缓存命中时不重复调用 DeepSeek。

---

## 9.7 第七阶段：DeepSeek AI 解读

### 目标

完成中文赛道 AI 解读功能。

### 任务

1. 创建 DeepSeek API 客户端。
2. 后端组装赛道数据、历史数据和赛历信息。
3. 使用固定 Prompt 请求结构化 JSON。
4. 校验 AI 返回内容。
5. 写入 `ai_insights` 缓存。
6. 前端展示 AI 分析。
7. 处理生成中、失败、重试状态。

### 验收标准

- 点击“生成 AI 分析”后能返回中文赛道解读。
- 同一赛道重复打开时优先读取缓存。
- AI 输出不编造输入数据中不存在的具体冠军、年份或纪录。
- DeepSeek API key 不暴露在前端。

---

## 9.8 第八阶段：视觉优化与部署

### 目标

提高项目完成度并上线展示。

### 任务

1. 优化地球光效。
2. 优化 Marker 动画。
3. 优化侧边栏玻璃态视觉。
4. 优化底部状态栏。
5. 处理接口错误提示。
6. 编写 README。
7. 配置部署环境变量。
8. 部署前端与 Serverless API。
9. 准备演示视频或 GIF。

### 验收标准

- 项目视觉完成度高。
- README 完整。
- 项目可以在线访问。
- 可用于作品集展示。

---

## 10. MVP 验收标准

完整全栈 MVP 至少应完成：

1. 页面为单页面应用。
2. 无传统顶部导航栏。
3. 无左侧浮动面板。
4. 主视觉区域显示 3D 地球。
5. 地球可以拖拽旋转和滚轮缩放。
6. 地球上显示全球 F1 赛道点位。
7. 点击赛道后右侧动态侧边栏弹出。
8. 侧边栏中展示赛道概览。
9. 侧边栏中可以切换历史数据、赛历信息、AI 解读。
10. 底部状态栏显示当前赛季、赛道数量、当前选中、数据源和连接状态。
11. Serverless API 可以返回赛道、历史数据、赛历和 AI 解读。
12. Postgres 可以缓存赛道基础数据和 AI 解读。
13. DeepSeek AI 解读可以正常生成或读取缓存。
14. Web 桌面端核心流程可用。
15. 项目可以运行并部署。

---

## 11. 测试与验证计划

### 11.1 单元测试

```text
latLngToVector3 经纬度转换半径正确
Circuit seed 数据字段完整
API DTO normalizer 能处理缺失字段
DeepSeek JSON 解析失败时返回明确错误
```

### 11.2 集成测试

```text
GET /api/circuits 返回赛道列表
GET /api/circuits/:circuitId/history 返回近五年结果或空状态
GET /api/circuits/:circuitId/calendar 返回当前赛季分站信息
POST /api/circuits/:circuitId/ai-insight 首次生成，二次命中缓存
```

### 11.3 浏览器验收

```text
地球可拖动旋转、滚轮缩放
赛道点位贴合地球表面
点击点位后右侧栏打开并显示对应赛道
标签页切换正常
Loading / Error / Empty 状态可见
1440x900 桌面视口无主要内容遮挡
```

### 11.4 命令验证

```powershell
npm test
npm run lint
npm run build
```

文档一致性检查：

```powershell
Select-String -Path "docs/F1_Globe_Explorer_SPA_Document.md" -Pattern "React|Node Serverless|Postgres|DeepSeek"
```

---

## 12. 后续升级方向

### 12.1 加入赛道搜索

虽然当前版本不设置左侧搜索面板，但后续可以通过快捷键或小型搜索浮层实现赛道搜索。

```text
按 Ctrl + K 打开赛道搜索浮层
输入 Singapore
选择 Marina Bay Street Circuit
地球自动定位并打开右侧侧边栏
```

---

### 12.2 加入赛道对比

在侧边栏中增加“加入对比”按钮，可以比较两个赛道：

- 长度。
- 弯道数量。
- 街道赛道 / 永久赛道。
- 历史冠军。
- 超车难度。
- 安全车概率。

---

### 12.3 加入机器学习预测

后续可以训练模型预测：

- 冠军概率。
- 登台概率。
- 完赛概率。
- 安全车概率。
- 进站策略风险。

---

### 12.4 加入车辆轨迹回放

利用 OpenF1 的位置数据和会话数据，后续可以在二维赛道图或 3D 小地图上展示车辆轨迹。

---

## 13. 项目最终展示话术

面试或作品集展示时，可以这样介绍：

> 这个项目是一个基于 React、React Three Fiber 和 Node Serverless API 的 F1 全球赛道数据可视化单页面应用。我没有采用传统的多页面结构，而是把 3D 地球作为唯一主视觉入口。用户点击地球上的赛道点位后，右侧动态侧边栏会展开，所有功能都集中在侧边栏中，包括赛道概览、历史数据、赛历信息和 DeepSeek 生成的中文 AI 赛道解读。底部状态栏负责展示当前赛季、已加载赛道、当前选中赛道和数据源状态。这个设计减少了页面跳转，让用户始终停留在沉浸式地球场景中完成数据探索。
