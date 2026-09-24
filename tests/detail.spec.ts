import { describe, expect, it } from 'vitest'
import {
  computeReplyTarget,
  displayLikes,
  formatTime,
  percentOf,
} from '../src/utils/detail-logic'

describe('detail-logic: displayLikes', () => {
  it('未点赞时返回基线值', () => {
    expect(displayLikes(10, false)).toBe(10)
  })

  it('已点赞时比基线多 1', () => {
    expect(displayLikes(10, true)).toBe(11)
  })

  it('基线为 0 且已点赞时返回 1', () => {
    expect(displayLikes(0, true)).toBe(1)
  })

  it('基线为 0 且未点赞时返回 0', () => {
    expect(displayLikes(0, false)).toBe(0)
  })
})

describe('detail-logic: formatTime', () => {
  // 以固定 now 作为基准，避免依赖系统时间
  const now = new Date('2026-09-24T12:00:00Z')

  it('不足 1 小时显示分钟前', () => {
    expect(formatTime('2026-09-24T11:30:00Z', now)).toBe('30分钟前')
  })

  it('59 分钟显示分钟前（临近小时边界）', () => {
    expect(formatTime('2026-09-24T11:01:00Z', now)).toBe('59分钟前')
  })

  it('刚满 1 小时显示小时前', () => {
    expect(formatTime('2026-09-24T11:00:00Z', now)).toBe('1小时前')
  })

  it('23 小时显示小时前（临近天边界）', () => {
    expect(formatTime('2026-09-23T13:00:00Z', now)).toBe('23小时前')
  })

  it('满 24 小时及以上显示 M月D日', () => {
    // 本地时区下 9 月 22 日，跨过 48 小时
    const out = formatTime('2026-09-22T12:00:00Z', now)
    expect(out).toMatch(/\d+月\d+日/)
    expect(out).not.toContain('前')
  })

  it('不传 now 时默认使用当前时间且不抛错', () => {
    expect(() => formatTime(new Date().toISOString())).not.toThrow()
  })
})

describe('detail-logic: percentOf', () => {
  it('正常百分比四舍五入', () => {
    // 156 / 642 = 24.30... → 24
    expect(percentOf(156, 642)).toBe(24)
  })

  it('整除返回精确值', () => {
    expect(percentOf(50, 100)).toBe(50)
  })

  it('0 票返回 0', () => {
    expect(percentOf(0, 100)).toBe(0)
  })

  it('总票数为 0 时按 1 计避免除零', () => {
    expect(percentOf(0, 0)).toBe(0)
    expect(percentOf(1, 0)).toBe(100)
  })

  it('超过总票数仍按比例计算（不做上限裁剪）', () => {
    expect(percentOf(200, 100)).toBe(200)
  })
})

describe('detail-logic: computeReplyTarget', () => {
  it('无 reply 时 @ 评论作者', () => {
    const t = computeReplyTarget(100, '夜空中最亮的星')
    expect(t.commentId).toBe(100)
    expect(t.replyToName).toBe('夜空中最亮的星')
  })

  it('有 reply 时 @ 回复对象', () => {
    const t = computeReplyTarget(100, '评论作者', { authorName: '被回复人' })
    expect(t.commentId).toBe(100)
    expect(t.replyToName).toBe('被回复人')
  })

  it('透传 commentId 与 reply.authorName', () => {
    const t = computeReplyTarget(42, 'A', { authorName: 'B' })
    expect(t).toEqual({ commentId: 42, replyToName: 'B' })
  })
})
