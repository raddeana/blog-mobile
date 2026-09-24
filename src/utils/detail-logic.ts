/**
 * 详情页纯逻辑函数
 * 抽离自 detail.vue，便于单元测试；亦供其它页面复用（时间格式化/投票百分比等）
 */
import type { Reply } from '@/api/comment'

/** 回复目标（楼中楼 @ 目标） */
export interface ReplyTarget {
  commentId: number
  replyToName: string
}

/** 显示点赞数：liked 态比基线多 1 */
export function displayLikes(likes: number, liked: boolean): number {
  return likes + (liked ? 1 : 0)
}

/**
 * 时间格式化：不足 1 小时→分钟前，不足 24 小时→小时前，否则 M月D日
 * @param iso ISO 时间字符串
 * @param now 当前时间基准，默认 new Date()（测试可传固定值）
 */
export function formatTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso)
  const diff = now.getTime() - d.getTime()
  const hours = diff / 3600000
  if (hours < 1) return Math.floor(diff / 60000) + '分钟前'
  if (hours < 24) return Math.floor(hours) + '小时前'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

/** 投票选项百分比（totalVotes 为 0 时按 1 计避免除零） */
export function percentOf(votes: number, totalVotes: number): number {
  const total = totalVotes || 1
  return Math.round((votes / total) * 100)
}

/** 推导回复目标：reply 存在则 @ 回复对象，否则 @ 评论作者 */
export function computeReplyTarget(
  commentId: number,
  commentAuthorName: string,
  reply?: Pick<Reply, 'authorName'>
): ReplyTarget {
  return {
    commentId,
    replyToName: reply ? reply.authorName : commentAuthorName,
  }
}
