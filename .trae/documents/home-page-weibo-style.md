# 首页开发计划 — 微博风格推荐 Feed

## Context
项目已有登录/注册/忘记密码三个页面，登录成功后会 `reLaunch` 到 `/pages/index/index`（目前不存在）。需要开发首页，展示推荐内容流，内容类型包括文章、投票、短信息，UI 风格参考微博。用户要求配置 TabBar 底部导航并预留接口调用。

## 约束
- 无图片资源/字体依赖，图标用纯 CSS 绘制（项目硬约束）
- 兼容移动端 web、微信小程序、Android、iOS
- 使用 rpx 响应式单位，var(--status-bar-height) 适配状态栏
- 样式使用 SCSS + uni.scss 品牌变量
- 原生 tabBar 需要 iconPath 图片，违反"无图片资源"约束 → 使用自定义 TabBar 组件 + CSS 图标

## 文件清单

### 新建
| 文件 | 用途 |
|------|------|
| `src/pages/index/index.vue` | 首页：顶部 Tab 切换 + Feed 列表 + 下拉刷新/上拉加载 |
| `src/pages/profile/profile.vue` | "我的"页：占位页面，包含 TabBar |
| `src/components/CustomTabBar.vue` | 自定义底部导航：首页 + 我的，CSS 绘制图标 |
| `src/components/FeedCard.vue` | Feed 卡片：根据 type 渲染文章/投票/短信息 |
| `src/api/feed.ts` | API 层：接口定义 + mock 数据 + async 函数（预留真实接口） |

### 修改
| 文件 | 改动 |
|------|------|
| `src/pages.json` | 添加 index、profile 路由；**不配 native tabBar**（使用自定义组件） |
| `src/uni.scss` | 新增 Feed 相关共享变量（卡片背景、边框等，可选） |

## 设计细节

### 1. CustomTabBar.vue
- 固定底部，`env(safe-area-inset-bottom)` 适配 iPhone 安全区
- 两个 Tab：首页（房子图标）、我的（人形图标），均纯 CSS 绘制
- 通过 `uni.$emit` / `uni.$on` 或 props 同步当前选中项
- 使用品牌渐变色高亮选中态

### 2. index.vue 首页
- **顶部栏**：固定，包含 Tab 切换（推荐/关注）+ 搜索图标
- **Feed 列表**：`scroll-view` 或 `onReachBottom` + `onPullDownRefresh`
- **数据流**：调用 `api/feed.ts` 中的 `fetchFeed()` 获取列表
- **空态/加载态**：CSS 加载动画

### 3. FeedCard.vue
- **通用结构**：用户头像（纯 CSS 默认头像）+ 昵称 + 时间 + 内容区 + 互动栏（点赞/评论/转发）
- **文章 (article)**：标题 + 摘要 + 纯 CSS 绘制封面占位
- **投票 (poll)**：问题 + 选项列表（带投票进度条）+ 参与人数
- **短信息 (message)**：纯文本内容
- **互动栏**：CSS 绘制心形/评论/转发图标，点击有动效

### 4. api/feed.ts
- TypeScript 接口：`FeedItem`、`ArticleItem`、`PollItem`、`MessageItem`
- Mock 数据：~10 条混合类型内容
- Async 函数：`fetchFeed(params): Promise<{ list: FeedItem[], hasMore: boolean }>`
- TODO 注释标记真实接口替换点

### 5. pages.json 路由
```json
{ "path": "pages/index/index", "style": { "navigationStyle": "custom" } }
{ "path": "pages/profile/profile", "style": { "navigationStyle": "custom" } }
```

## 验证
1. `pnpm type-check` 无类型错误
2. `pnpm dev:h5` 后 HTTP 探测 `/src/pages/index/index.vue` 编译成功
3. 浏览器访问 `http://localhost:5173/#/pages/index/index` 确认页面渲染
4. `pnpm test` 确认现有 SCSS 测试不受影响
