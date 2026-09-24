/**
 * 内容管理 API 层
 * 预留真实接口调用位置，当前使用 mock 数据
 */

/* ---- 类型定义 ---- */

export type ContentType = 'article' | 'message' | 'poll'

/** 媒体附件 */
export interface MediaItem {
  id: number
  type: 'image' | 'video' | 'audio'
  url: string // mock: 临时路径
  thumbUrl?: string
}

/** 投票选项（草稿态无 votes） */
export interface PollOptionInput {
  id: number
  text: string
}

/** 内容条目基础字段 */
export interface BaseContentItem {
  id: number
  type: ContentType
  authorId: number // mock 固定为 0（自己）
  createdAt: string // ISO 时间字符串
  updatedAt: string // ISO 时间字符串
  status: 'draft' | 'published'
}

/** 文章类型 */
export interface ArticleContent extends BaseContentItem {
  type: 'article'
  title: string
  body: string // 富文本 HTML
  medias: MediaItem[]
}

/** 短消息类型 */
export interface MessageContent extends BaseContentItem {
  type: 'message'
  body: string // 纯文本（≤200 字符）
  medias: MediaItem[]
}

/** 投票类型 */
export interface PollContent extends BaseContentItem {
  type: 'poll'
  body: string // 富文本问题（≤500 纯文本长度）
  pollOptions: PollOptionInput[]
}

export type ContentItem = ArticleContent | MessageContent | PollContent

export type CreateContentInput =
  | Omit<ArticleContent, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>
  | Omit<MessageContent, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>
  | Omit<PollContent, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>

export type UpdateContentInput = Partial<CreateContentInput> & { type: ContentType }

/* ---- Mock 数据 ---- */

let contentIdSeed = 100
let mediaIdSeed = 1

/** 列表需要刷新标志 —— 编辑页保存/删除后置 true，列表页 onShow 检测后拉取并复位 */
let myContentDirty = false
export function markMyContentDirty() {
  myContentDirty = true
}
/** 拉取并复位 dirty 标志（原子操作，避免每次 onShow 无谓请求） */
export function consumeMyContentDirty(): boolean {
  const d = myContentDirty
  myContentDirty = false
  return d
}

const mockMyContent: ContentItem[] = [
  {
    id: 1, type: 'article', authorId: 0,
    createdAt: '2026-09-23T14:00:00Z', updatedAt: '2026-09-23T14:00:00Z',
    status: 'published',
    title: '我的第一篇内容管理文章',
    body: '<p>这是用内容管理功能创建的示例文章，支持富文本编辑。</p>',
    medias: [],
  },
  {
    id: 2, type: 'message', authorId: 0,
    createdAt: '2026-09-23T10:00:00Z', updatedAt: '2026-09-23T11:00:00Z',
    status: 'published',
    body: '今天内容管理功能上线了，开心！',
    medias: [],
  },
  {
    id: 3, type: 'poll', authorId: 0,
    createdAt: '2026-09-22T16:00:00Z', updatedAt: '2026-09-22T16:00:00Z',
    status: 'published',
    body: '<p>你最希望内容管理支持哪种新能力？</p>',
    pollOptions: [
      { id: 1, text: 'Markdown 导入' },
      { id: 2, text: '定时发布' },
      { id: 3, text: '草稿云端同步' },
    ],
  },
]

/* ---- API 函数 ---- */

/**
 * 获取我发布的内容列表
 * TODO: 替换为真实接口调用
 */
export async function fetchMyContent(): Promise<ContentItem[]> {
  // TODO: const res = await uni.request({ url: '/api/my-content' })
  await new Promise(resolve => setTimeout(resolve, 400))
  return [...mockMyContent].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/**
 * 根据 id 获取单条内容
 * TODO: 替换为真实接口调用
 */
export async function getContentById(id: number): Promise<ContentItem | null> {
  // TODO: const res = await uni.request({ url: `/api/my-content/${id}` })
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockMyContent.find(c => c.id === id) ?? null
}

/**
 * 新建内容
 * TODO: 替换为真实接口调用
 */
export async function createContent(input: CreateContentInput): Promise<ContentItem> {
  // TODO: await uni.request({ url: '/api/my-content', method: 'POST', data: input })
  await new Promise(resolve => setTimeout(resolve, 300))
  const now = new Date().toISOString()
  const item = {
    ...input,
    id: ++contentIdSeed,
    authorId: 0,
    createdAt: now,
    updatedAt: now,
    status: 'published',
  } as ContentItem
  mockMyContent.push(item)
  markMyContentDirty()
  return item
}

/**
 * 更新内容
 * TODO: 替换为真实接口调用
 */
export async function updateContent(id: number, input: UpdateContentInput): Promise<ContentItem> {
  // TODO: await uni.request({ url: `/api/my-content/${id}`, method: 'PUT', data: input })
  await new Promise(resolve => setTimeout(resolve, 300))
  const idx = mockMyContent.findIndex(c => c.id === id)
  if (idx < 0) throw new Error('内容不存在')
  const updated = { ...mockMyContent[idx], ...input, updatedAt: new Date().toISOString() } as ContentItem
  mockMyContent[idx] = updated
  markMyContentDirty()
  return updated
}

/**
 * 删除内容
 * TODO: 替换为真实接口调用
 */
export async function deleteContent(id: number): Promise<void> {
  // TODO: await uni.request({ url: `/api/my-content/${id}`, method: 'DELETE' })
  await new Promise(resolve => setTimeout(resolve, 200))
  const idx = mockMyContent.findIndex(c => c.id === id)
  if (idx >= 0) mockMyContent.splice(idx, 1)
  markMyContentDirty()
}

/**
 * mock 上传媒体
 * TODO: 替换为真实接口调用
 */
export async function uploadMedia(file: { path: string; type: 'image' | 'video' | 'audio' }): Promise<MediaItem> {
  // TODO: const res = await uni.uploadFile({ url: '/api/upload', filePath: file.path })
  await new Promise(resolve => setTimeout(resolve, 200))
  return {
    id: ++mediaIdSeed,
    type: file.type,
    url: file.path,
  }
}
