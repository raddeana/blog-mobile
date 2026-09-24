/**
 * 内容管理纯逻辑函数
 * 抽离自 editor.vue，便于单元测试；亦供列表页复用
 * 不依赖 DOM（小程序无 DOM API），用正则处理富文本
 */
import type { ContentType } from '@/api/content'

/** 从富文本 HTML 提取纯文本 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '') // 去标签
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** 富文本字符数统计（按纯文本长度） */
export function charCount(html: string): number {
  return htmlToPlainText(html).length
}

/** 投票选项校验：至少 2 项、非空、去重 */
export function validatePollOptions(options: { text: string }[]): {
  valid: boolean
  reason?: 'empty' | 'too-few' | 'duplicate'
  emptyIndex?: number
  duplicateText?: string
} {
  if (options.length < 2) return { valid: false, reason: 'too-few' }
  for (let i = 0; i < options.length; i++) {
    if (!options[i].text.trim()) return { valid: false, reason: 'empty', emptyIndex: i }
  }
  const seen = new Set<string>()
  for (const o of options) {
    const t = o.text.trim()
    if (seen.has(t)) return { valid: false, reason: 'duplicate', duplicateText: t }
    seen.add(t)
  }
  return { valid: true }
}

/** 短消息正文校验（≤200 字符） */
export function validateMessageBody(text: string): { valid: boolean; overflow: number } {
  const len = text.length
  if (len > 200) return { valid: false, overflow: len - 200 }
  return { valid: true, overflow: 0 }
}

/** 媒体类型标签 */
export function mediaTypeLabel(type: 'image' | 'video' | 'audio'): string {
  return type === 'image' ? '图片' : type === 'video' ? '视频' : '音频'
}

/** 内容类型标签 */
export function contentTypeLabel(type: ContentType): string {
  return type === 'article' ? '文章' : type === 'message' ? '短消息' : '投票'
}

/** 摘要：纯文本截断 + 省略号 */
export function summarize(html: string, max = 60): string {
  const text = htmlToPlainText(html)
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}
