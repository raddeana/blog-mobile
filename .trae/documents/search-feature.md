# 搜索功能开发计划

## Context
首页顶部已有搜索图标入口（`index.vue` L14 `@tap="onSearch"`），当前 `onSearch()` 仅弹出 Toast "搜索功能开发中"。需要开发完整的搜索页面，包含搜索输入、搜索历史、热门搜索、搜索结果展示。

## 需要修改/新建的文件

### 1. 新建 `src/api/search.ts` — 搜索 API 层
参照 `src/api/feed.ts` 的模式（TypeScript 接口 + mock 数据 + async 函数 + `uni.request` TODO）。

- `SearchQuery` 接口：`{ keyword: string; page: number; pageSize: number }`
- `SearchResult` 接口：`{ list: FeedItem[]; hasMore: boolean }`（复用 `FeedItem` 类型）
- `searchFeed(query: SearchQuery)` 函数：从 `feed.ts` 的 mockData 中按 keyword 过滤 title/excerpt/content/question/authorName/tags 字段，模拟分页
- `getHotKeywords()` 函数：返回热门搜索词数组（mock）
- `getSearchHistory()` / `addSearchHistory(keyword)` / `clearSearchHistory()` 函数：使用 `uni.getStorageSync` / `uni.setStorageSync` 管理本地搜索历史

### 2. 新建 `src/pages/search/search.vue` — 搜索页面
**页面风格**：浅色主题，与首页一致（`background: #f5f5f7`），自定义导航栏（`navigationStyle: custom`）。

**布局结构**：
```
┌─────────────────────────────────┐
│ [返回] [搜索输入框......] [搜索] │ ← 顶部导航栏（白色背景，fixed）
├─────────────────────────────────┤
│ 搜索历史                  [清空] │
│ [uni-app] [CSS] [跨端] [Vue]    │ ← 历史标签（品牌紫边框圆角）
├─────────────────────────────────┤
│ 热门搜索                         │
│ 1 uni-app开发   2 CSS技巧        │
│ 3 微信小程序    4 前端趋势       │ ← 热搜列表（序号+关键词）
└─────────────────────────────────┘

搜索后：
┌─────────────────────────────────┐
│ [返回] [搜索输入框......] [搜索] │
├─────────────────────────────────┤
│  FeedCard FeedCard FeedCard...  │ ← 复用 FeedCard 组件展示结果
│  加载更多 / 没有更多了           │
└─────────────────────────────────┘
```

**关键实现点**：
- 顶部导航栏：`padding-top: calc(var(--status-bar-height) + 16rpx)`，白色背景
- 返回箭头：纯 CSS 绘制（与 register.vue / forgot.vue 一致的 `.back-arrow` 旋转方块方案），颜色为 `#333`
- 搜索输入框：内联实现（不复用 BeautifulInput，因其为深色主题设计），白色背景 + `#f0f0f2` 圆角输入框，左侧纯 CSS 搜索图标（复用 index.vue 的 `.ic-search` 设计但缩小），`confirm-type="search"` 触发搜索
- 搜索按钮：品牌紫文字按钮 `#7b5cff`
- 历史标签：`hover-class` + 品牌紫边框 `rgba(123, 92, 255, 0.3)` + 浅紫背景
- 热搜序号：前三名使用品牌粉 `#ff5c9d`，其余 `#bbb`
- 搜索结果：复用 `FeedCard` 组件 + 上拉加载（`onReachBottom`）
- 空结果态：复用 index.vue 的空态样式（`.empty-state`）
- 加载态：复用 index.vue 的 loading dots 动画

**Script 逻辑**：
- `keyword` ref 绑定输入框
- `history` ref 从 `getSearchHistory()` 加载
- `hotKeywords` ref 从 `getHotKeywords()` 加载
- `resultList` ref + `loading` + `hasMore` + `page` reactive
- `doSearch()` — 调用 `searchFeed()`，写入搜索历史
- `onReachBottom` — 上拉加载更多搜索结果
- `tapHistory(keyword)` / `tapHot(keyword)` — 点击标签直接搜索
- `clearHistory()` — 清空搜索历史

### 3. 修改 `src/pages/index/index.vue`
- `onSearch()` 改为 `uni.navigateTo({ url: '/pages/search/search' })`

### 4. 修改 `src/pages.json`
- 注册搜索页路由：
```json
{
  "path": "pages/search/search",
  "style": {
    "navigationBarTitleText": "搜索",
    "navigationStyle": "custom",
    "navigationBarTextStyle": "black"
  }
}
```

### 5. 补充 `tests/scss.spec.ts`
新增 `describe('search.vue SCSS 样式块')` 测试组，验证：
- 可被 dart-sass 无错编译
- 顶部导航栏 fixed 定位 + 白色背景
- 返回箭头使用 45° 旋转绘制
- 搜索输入框圆角 + 浅灰背景
- 搜索图标包含圆圈和手柄
- 历史标签使用品牌紫边框
- 热搜序号前三名使用品牌粉色
- 空结果态使用半透明品牌紫

## 验证步骤
1. `pnpm test` — 全部测试通过（含新增搜索页测试）
2. `pnpm dev:h5` — dev 编译无报错
3. HTTP 探测 `http://localhost:5173/src/pages/search/search.vue` 确认编译产物
4. `pnpm run build:mp-weixin` — 微信小程序构建成功
