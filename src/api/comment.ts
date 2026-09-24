/**
 * 评论 API 层
 * 预留真实接口调用位置，当前使用 mock 数据
 */

/* ---- 类型定义 ---- */

/** 评论作者信息 */
export interface CommentAuthor {
  id: number
  name: string
  avatar: string // 空字符串时前端用纯 CSS 默认头像
}

/** 回复（楼中楼，一层嵌套） */
export interface Reply {
  id: number
  commentId: number
  authorId: number
  authorName: string
  authorAvatar: string
  content: string
  createdAt: string // ISO 时间字符串
  likes: number
  liked: boolean
  replyToName?: string // @ 回复目标用户名
}

/** 评论 */
export interface Comment {
  id: number
  feedId: number
  authorId: number
  authorName: string
  authorAvatar: string
  content: string
  createdAt: string
  likes: number
  liked: boolean
  replies: Reply[]
}

/** 评论分页查询参数 */
export interface CommentQuery {
  feedId: number
  page: number
  pageSize: number
}

/** 评论分页返回结果 */
export interface CommentResult {
  list: Comment[]
  hasMore: boolean
  total: number
}

/* ---- Mock 数据 ---- */

const commentAuthors = [
  { id: 101, name: '夜空中最亮的星', avatar: '' },
  { id: 102, name: '前端小白菜', avatar: '' },
  { id: 103, name: '代码搬运工', avatar: '' },
  { id: 104, name: '沉默的观察者', avatar: '' },
  { id: 105, name: '风中的承诺', avatar: '' },
  { id: 106, name: '晨光微露', avatar: '' },
  { id: 107, name: '调试到天明', avatar: '' },
  { id: 108, name: '理想主义者', avatar: '' },
]

let replyIdSeed = 5000
let commentIdSeed = 1000

function nowISO(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60000)
  return d.toISOString()
}

/** 为每个 feedId 预生成评论 */
const mockComments: Comment[] = [
  {
    id: 100, feedId: 1, authorId: 101, authorName: commentAuthors[0].name, authorAvatar: '',
    content: 'uni-app 确实方便，一套代码多端运行，省了不少维护成本。',
    createdAt: nowISO(120), likes: 24, liked: false,
    replies: [
      {
        id: 5001, commentId: 100, authorId: 102, authorName: commentAuthors[1].name, authorAvatar: '',
        content: '同意，不过小程序端有些样式还是要单独处理。', createdAt: nowISO(90), likes: 5, liked: false,
      },
      {
        id: 5002, commentId: 100, authorId: 103, authorName: commentAuthors[2].name, authorAvatar: '',
        content: '回复 @前端小白菜：分包加载是个坑，提前规划好就行。', createdAt: nowISO(60), likes: 2, liked: false,
        replyToName: '前端小白菜',
      },
    ],
  },
  {
    id: 101, feedId: 1, authorId: 104, authorName: commentAuthors[3].name, authorAvatar: '',
    content: '求一篇专门讲条件编译的实战文章，最近被 #ifdef 折磨得不行。',
    createdAt: nowISO(80), likes: 12, liked: false,
    replies: [],
  },
  {
    id: 102, feedId: 1, authorId: 105, authorName: commentAuthors[4].name, authorAvatar: '',
    content: '封面渐变好看，纯 CSS 就能画出来，学到了。',
    createdAt: nowISO(40), likes: 8, liked: true,
    replies: [
      {
        id: 5003, commentId: 102, authorId: 101, authorName: commentAuthors[0].name, authorAvatar: '',
        content: 'conic-gradient 也很香，一行画饼图。', createdAt: nowISO(30), likes: 3, liked: false,
      },
    ],
  },
  {
    id: 103, feedId: 1, authorId: 106, authorName: commentAuthors[5].name, authorAvatar: '',
    content: '已收藏，准备照着搭一个项目练练手。',
    createdAt: nowISO(20), likes: 5, liked: false,
    replies: [],
  },
  {
    id: 200, feedId: 2, authorId: 107, authorName: commentAuthors[6].name, authorAvatar: '',
    content: '果断 SCSS，变量和 mixin 太好用了。',
    createdAt: nowISO(180), likes: 36, liked: false,
    replies: [
      {
        id: 5101, commentId: 200, authorId: 108, authorName: commentAuthors[7].name, authorAvatar: '',
        content: 'Less 用惯了，切 SCSS 有点不适应嵌套写法。', createdAt: nowISO(150), likes: 4, liked: false,
      },
    ],
  },
  {
    id: 201, feedId: 2, authorId: 101, authorName: commentAuthors[0].name, authorAvatar: '',
    content: '其实 PostCSS 配合插件也很强，只是配置略繁琐。',
    createdAt: nowISO(100), likes: 18, liked: false,
    replies: [],
  },
  {
    id: 202, feedId: 2, authorId: 102, authorName: commentAuthors[1].name, authorAvatar: '',
    content: 'Stylus 的缩进语法一旦习惯就回不去了。',
    createdAt: nowISO(50), likes: 7, liked: false,
    replies: [],
  },
  {
    id: 300, feedId: 3, authorId: 103, authorName: commentAuthors[2].name, authorAvatar: '',
    content: '“在正确的时候按下回车键”——这句写得太有感觉了。',
    createdAt: nowISO(90), likes: 42, liked: true,
    replies: [
      {
        id: 5201, commentId: 300, authorId: 104, authorName: commentAuthors[3].name, authorAvatar: '',
        content: '代码和诗的共同点：都需要分行。', createdAt: nowISO(70), likes: 9, liked: false,
      },
      {
        id: 5202, commentId: 300, authorId: 105, authorName: commentAuthors[4].name, authorAvatar: '',
        content: '回复 @沉默的观察者：哈哈这个比喻精辟。', createdAt: nowISO(60), likes: 3, liked: false,
        replyToName: '沉默的观察者',
      },
    ],
  },
  {
    id: 301, feedId: 3, authorId: 106, authorName: commentAuthors[5].name, authorAvatar: '',
    content: '秋天的风确实凉了，注意保暖～',
    createdAt: nowISO(45), likes: 6, liked: false,
    replies: [],
  },
  {
    id: 400, feedId: 4, authorId: 107, authorName: commentAuthors[6].name, authorAvatar: '',
    content: 'React 19 的 Server Components 真的改变了写前端的思路。',
    createdAt: nowISO(200), likes: 58, liked: false,
    replies: [],
  },
  {
    id: 401, feedId: 4, authorId: 108, authorName: commentAuthors[7].name, authorAvatar: '',
    content: 'Islands Architecture 在内容站上效果显著，首屏快了一大截。',
    createdAt: nowISO(150), likes: 31, liked: false,
    replies: [],
  },
  {
    id: 402, feedId: 4, authorId: 101, authorName: commentAuthors[0].name, authorAvatar: '',
    content: '期待 Vue 3.5 的更多更新，useTemplateRef 用着真舒服。',
    createdAt: nowISO(80), likes: 22, liked: false,
    replies: [],
  },
]

/** 通用 feedId 的兜底评论（mock 数据中没有对应项时使用） */
function genFallbackComments(feedId: number): Comment[] {
  return [
    {
      id: ++commentIdSeed, feedId, authorId: 101, authorName: commentAuthors[0].name, authorAvatar: '',
      content: '这条内容挺有意思的，先马后看。', createdAt: nowISO(30), likes: 5, liked: false, replies: [],
    },
    {
      id: ++commentIdSeed, feedId, authorId: 102, authorName: commentAuthors[1].name, authorAvatar: '',
      content: '感觉可以再深入聊聊实现细节。', createdAt: nowISO(15), likes: 2, liked: false, replies: [],
    },
    {
      id: ++commentIdSeed, feedId, authorId: 103, authorName: commentAuthors[2].name, authorAvatar: '',
      content: '支持下作者，继续更～', createdAt: nowISO(8), likes: 1, liked: false, replies: [],
    },
  ]
}

function commentsForFeed(feedId: number): Comment[] {
  const list = mockComments.filter(c => c.feedId === feedId)
  return list.length > 0 ? list : genFallbackComments(feedId)
}

/* ---- API 函数 ---- */

/**
 * 获取评论列表
 * TODO: 替换为真实接口调用
 */
export async function fetchComments(query: CommentQuery): Promise<CommentResult> {
  // TODO: const res = await uni.request({ url: `/api/feed/${query.feedId}/comments`, data: query })
  await new Promise(resolve => setTimeout(resolve, 400))

  const all = commentsForFeed(query.feedId)
  const start = (query.page - 1) * query.pageSize
  const end = start + query.pageSize
  const list = all.slice(start, end)
  const hasMore = end < all.length

  return { list, hasMore, total: all.length }
}

/**
 * 发表评论
 * TODO: 替换为真实接口调用
 */
export async function addComment(feedId: number, content: string): Promise<Comment> {
  // TODO: await uni.request({ url: `/api/feed/${feedId}/comments`, method: 'POST', data: { content } })
  await new Promise(resolve => setTimeout(resolve, 200))
  return {
    id: ++commentIdSeed,
    feedId,
    authorId: 0,
    authorName: '我',
    authorAvatar: '',
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
    replies: [],
  }
}

/**
 * 回复评论
 * TODO: 替换为真实接口调用
 */
export async function addReply(
  commentId: number,
  content: string,
  replyToName?: string
): Promise<Reply> {
  // TODO: await uni.request({ url: `/api/comments/${commentId}/replies`, method: 'POST', data: { content, replyToName } })
  await new Promise(resolve => setTimeout(resolve, 200))
  return {
    id: ++replyIdSeed,
    commentId,
    authorId: 0,
    authorName: '我',
    authorAvatar: '',
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
    replyToName,
  }
}

/**
 * 评论点赞 / 取消点赞
 * TODO: 替换为真实接口调用
 */
export async function toggleCommentLike(commentId: number, liked: boolean): Promise<void> {
  // TODO: await uni.request({ url: `/api/comments/${commentId}/like`, method: 'POST' })
  await new Promise(resolve => setTimeout(resolve, 150))
}

/**
 * 回复点赞 / 取消点赞
 * TODO: 替换为真实接口调用
 */
export async function toggleReplyLike(replyId: number, liked: boolean): Promise<void> {
  // TODO: await uni.request({ url: `/api/replies/${replyId}/like`, method: 'POST' })
  await new Promise(resolve => setTimeout(resolve, 150))
}
