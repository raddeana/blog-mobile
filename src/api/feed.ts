/**
 * Feed API 层
 * 预留真实接口调用位置，当前使用 mock 数据
 */

/* ---- 类型定义 ---- */

export type FeedType = 'article' | 'poll' | 'message'

/** 投票选项 */
export interface PollOption {
  id: number
  text: string
  votes: number
}

/** Feed 条目基础字段 */
export interface BaseFeedItem {
  id: number
  type: FeedType
  authorId: number
  authorName: string
  authorAvatar: string // 空字符串时前端用纯 CSS 默认头像
  createdAt: string // ISO 时间字符串
  likes: number
  comments: number
  shares: number
  liked: boolean
}

/** 文章类型 */
export interface ArticleItem extends BaseFeedItem {
  type: 'article'
  title: string
  excerpt: string
  coverGradient: string // CSS gradient 值，用于纯 CSS 封面占位
  tags: string[]
}

/** 投票类型 */
export interface PollItem extends BaseFeedItem {
  type: 'poll'
  question: string
  options: PollOption[]
  totalVotes: number
  expired: boolean
}

/** 短信息类型 */
export interface MessageItem extends BaseFeedItem {
  type: 'message'
  content: string
}

export type FeedItem = ArticleItem | PollItem | MessageItem

/** 分页查询参数 */
export interface FeedQuery {
  page: number
  pageSize: number
  tab: 'recommend' | 'follow'
}

/** 分页返回结果 */
export interface FeedResult {
  list: FeedItem[]
  hasMore: boolean
}

/* ---- Mock 数据 ---- */

const mockAuthors = [
  { id: 1, name: '风轻云淡', avatar: '' },
  { id: 2, name: '码农老张', avatar: '' },
  { id: 3, name: '诗与远方', avatar: '' },
  { id: 4, name: '科技观察者', avatar: '' },
  { id: 5, name: '生活小记', avatar: '' },
]

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]

export const mockData: FeedItem[] = [
  {
    id: 1, type: 'article', authorId: 1, authorName: mockAuthors[0].name, authorAvatar: '',
    createdAt: '2026-09-23T14:30:00Z',
    title: 'uni-app 跨端开发实战：从零到上线',
    excerpt: '本文详细介绍了如何使用 uni-app 框架开发同时兼容 H5、微信小程序、Android 和 iOS 的应用，涵盖项目搭建、组件封装、样式适配等核心内容。',
    coverGradient: gradients[0],
    tags: ['uni-app', '前端', '跨端'],
    likes: 328, comments: 56, shares: 42, liked: false,
  },
  {
    id: 2, type: 'poll', authorId: 2, authorName: mockAuthors[1].name, authorAvatar: '',
    createdAt: '2026-09-23T13:00:00Z',
    question: '你日常开发中使用哪种 CSS 预处理器？',
    options: [
      { id: 1, text: 'SCSS / Sass', votes: 156 },
      { id: 2, text: 'Less', votes: 89 },
      { id: 3, text: 'Stylus', votes: 34 },
      { id: 4, text: 'PostCSS', votes: 67 },
    ],
    totalVotes: 346,
    expired: false,
    likes: 72, comments: 28, shares: 15, liked: false,
  },
  {
    id: 3, type: 'message', authorId: 3, authorName: mockAuthors[2].name, authorAvatar: '',
    createdAt: '2026-09-23T12:15:00Z',
    content: '今天的天空特别蓝，秋天的风已经带着凉意了。突然觉得，写代码和写诗一样，都需要在正确的时候按下回车键。',
    likes: 145, comments: 32, shares: 8, liked: true,
  },
  {
    id: 4, type: 'article', authorId: 4, authorName: mockAuthors[3].name, authorAvatar: '',
    createdAt: '2026-09-23T10:00:00Z',
    title: '2026 前端框架趋势报告',
    excerpt: '从 Vue 3.5 到 React 19，从 Server Components 到 Islands Architecture，2026 年的前端生态正在发生深刻变革。本文将带您全面梳理最新趋势。',
    coverGradient: gradients[2],
    tags: ['前端', '框架', '趋势'],
    likes: 512, comments: 128, shares: 96, liked: false,
  },
  {
    id: 5, type: 'message', authorId: 5, authorName: mockAuthors[4].name, authorAvatar: '',
    createdAt: '2026-09-23T09:30:00Z',
    content: '推荐一个好用的 CSS 技巧：用 conic-gradient 画饼图，只需要一行代码。分享给大家 ~',
    likes: 89, comments: 12, shares: 45, liked: false,
  },
  {
    id: 6, type: 'poll', authorId: 1, authorName: mockAuthors[0].name, authorAvatar: '',
    createdAt: '2026-09-23T08:00:00Z',
    question: '你更倾向于哪种移动端跨端方案？',
    options: [
      { id: 1, text: 'uni-app', votes: 234 },
      { id: 2, text: 'Taro', votes: 123 },
      { id: 3, text: 'Flutter', votes: 198 },
      { id: 4, text: 'React Native', votes: 87 },
    ],
    totalVotes: 642,
    expired: false,
    likes: 156, comments: 67, shares: 34, liked: false,
  },
  {
    id: 7, type: 'article', authorId: 2, authorName: mockAuthors[1].name, authorAvatar: '',
    createdAt: '2026-09-22T20:00:00Z',
    title: '纯 CSS 实现复杂交互效果的 10 个案例',
    excerpt: '不依赖任何 JavaScript，仅用 CSS 就能实现手风琴、模态框、下拉菜单等交互效果。本文收集了 10 个实用案例。',
    coverGradient: gradients[4],
    tags: ['CSS', '交互', '无JS'],
    likes: 267, comments: 45, shares: 78, liked: false,
  },
  {
    id: 8, type: 'message', authorId: 3, authorName: mockAuthors[2].name, authorAvatar: '',
    createdAt: '2026-09-22T18:30:00Z',
    content: '调试了一下午的 bug，最后发现是少了一个分号。程序员的快乐就是这么简单。',
    likes: 234, comments: 56, shares: 12, liked: true,
  },
  {
    id: 9, type: 'article', authorId: 4, authorName: mockAuthors[3].name, authorAvatar: '',
    createdAt: '2026-09-22T15:00:00Z',
    title: '微信小程序性能优化完全指南',
    excerpt: '从分包加载到 setData 优化，从骨架屏到虚拟列表，本文系统性地介绍微信小程序性能优化的方方面面。',
    coverGradient: gradients[1],
    tags: ['小程序', '性能优化', '微信'],
    likes: 389, comments: 78, shares: 102, liked: false,
  },
  {
    id: 10, type: 'poll', authorId: 5, authorName: mockAuthors[4].name, authorAvatar: '',
    createdAt: '2026-09-22T12:00:00Z',
    question: '你的电脑主要操作系统是？',
    options: [
      { id: 1, text: 'Windows', votes: 312 },
      { id: 2, text: 'macOS', votes: 245 },
      { id: 3, text: 'Linux', votes: 98 },
    ],
    totalVotes: 655,
    expired: true,
    likes: 45, comments: 23, shares: 6, liked: false,
  },
]

/* ---- API 函数 ---- */

/**
 * 获取 Feed 列表
 * TODO: 替换为真实接口调用
 */
export async function fetchFeed(query: FeedQuery): Promise<FeedResult> {
  // TODO: const res = await uni.request({ url: '/api/feed', data: query })
  await new Promise(resolve => setTimeout(resolve, 500))

  const start = (query.page - 1) * query.pageSize
  const end = start + query.pageSize
  // 模拟分页：循环使用 mock 数据
  const allData = query.tab === 'follow' ? mockData.slice(0, 5) : mockData
  const list = allData.slice(start, end)
  const hasMore = end < allData.length

  return { list, hasMore }
}

/**
 * 点赞 / 取消点赞
 * TODO: 替换为真实接口调用
 */
export async function toggleLike(itemId: number, liked: boolean): Promise<void> {
  // TODO: await uni.request({ url: `/api/feed/${itemId}/like`, method: 'POST' })
  await new Promise(resolve => setTimeout(resolve, 200))
}

/**
 * 投票
 * TODO: 替换为真实接口调用
 */
export async function castVote(pollId: number, optionId: number): Promise<{ optionId: number; votes: number }[]> {
  // TODO: await uni.request({ url: `/api/feed/${pollId}/vote`, method: 'POST', data: { optionId } })
  await new Promise(resolve => setTimeout(resolve, 300))
  return []
}

/**
 * 根据 id 获取单条 Feed（用于评论页展示原帖等）
 * TODO: 替换为真实接口调用
 */
export async function getFeedById(id: number): Promise<FeedItem | null> {
  // TODO: const res = await uni.request({ url: `/api/feed/${id}` })
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockData.find(item => item.id === id) ?? null
}
