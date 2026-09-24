/**
 * 搜索 API 层
 * 预留真实接口调用位置，当前使用 mock 数据
 */

import { mockData } from './feed'
import type { FeedItem } from './feed'

/* ---- 类型定义 ---- */

/** 搜索查询参数 */
export interface SearchQuery {
  keyword: string
  page: number
  pageSize: number
}

/** 搜索返回结果 */
export interface SearchResult {
  list: FeedItem[]
  hasMore: boolean
}

/* ---- Mock 数据 ---- */

const hotKeywords = [
  'uni-app',
  'CSS 技巧',
  '微信小程序',
  '前端趋势',
  '跨端开发',
  '性能优化',
  'Vue 3',
  '纯 CSS 交互',
]

const HISTORY_KEY = 'search_history'
const MAX_HISTORY = 10

/* ---- API 函数 ---- */

/**
 * 搜索 Feed 内容
 * TODO: 替换为真实接口调用
 */
export async function searchFeed(query: SearchQuery): Promise<SearchResult> {
  // TODO: const res = await uni.request({ url: '/api/search', data: query })
  await new Promise(resolve => setTimeout(resolve, 500))

  const kw = query.keyword.trim().toLowerCase()
  if (!kw) return { list: [], hasMore: false }

  // 按 title / excerpt / content / question / authorName / tags 过滤
  const filtered = mockData.filter(item => {
    const fields: string[] = []
    if (item.type === 'article') {
      fields.push(item.title, item.excerpt, ...item.tags)
    } else if (item.type === 'poll') {
      fields.push(item.question)
    } else if (item.type === 'message') {
      fields.push(item.content)
    }
    fields.push(item.authorName)
    return fields.some(f => f.toLowerCase().includes(kw))
  })

  const start = (query.page - 1) * query.pageSize
  const end = start + query.pageSize
  const list = filtered.slice(start, end)
  const hasMore = end < filtered.length

  return { list, hasMore }
}

/**
 * 获取热门搜索关键词
 * TODO: 替换为真实接口调用
 */
export async function getHotKeywords(): Promise<string[]> {
  // TODO: const res = await uni.request({ url: '/api/search/hot' })
  await new Promise(resolve => setTimeout(resolve, 200))
  return hotKeywords
}

/**
 * 获取搜索历史（本地存储）
 */
export function getSearchHistory(): string[] {
  const history = uni.getStorageSync(HISTORY_KEY)
  return Array.isArray(history) ? history : []
}

/**
 * 添加搜索历史（去重、最新在前、限制数量）
 */
export function addSearchHistory(keyword: string): void {
  const kw = keyword.trim()
  if (!kw) return
  const history = getSearchHistory()
  const idx = history.indexOf(kw)
  if (idx > -1) history.splice(idx, 1)
  history.unshift(kw)
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY
  uni.setStorageSync(HISTORY_KEY, history)
}

/**
 * 清空搜索历史
 */
export function clearSearchHistory(): void {
  uni.removeStorageSync(HISTORY_KEY)
}
