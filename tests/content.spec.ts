import { describe, expect, it } from 'vitest'
import {
  charCount,
  contentTypeLabel,
  htmlToPlainText,
  mediaTypeLabel,
  summarize,
  validateMessageBody,
  validatePollOptions,
} from '../src/utils/content-logic'

describe('content-logic: htmlToPlainText', () => {
  it('纯文本原样返回', () => {
    expect(htmlToPlainText('hello')).toBe('hello')
  })

  it('去除 HTML 标签', () => {
    expect(htmlToPlainText('<p>hello <b>world</b></p>')).toBe('hello world')
  })

  it('解码常见实体', () => {
    expect(htmlToPlainText('a&nbsp;b&lt;c&gt;d&quot;e&#39;f')).toBe('a b<c>d"e\'f')
  })
})

describe('content-logic: charCount', () => {
  it('纯文本返回原长度', () => {
    expect(charCount('hello')).toBe(5)
  })

  it('HTML 去标签后统计', () => {
    expect(charCount('<p>hello <b>world</b></p>')).toBe(11)
  })

  it('空 HTML 返回 0', () => {
    expect(charCount('<p></p>')).toBe(0)
  })

  it('包含 &nbsp; 实体按 1 字符计', () => {
    expect(charCount('a&nbsp;b')).toBe(3)
  })
})

describe('content-logic: validatePollOptions', () => {
  it('2 项非空通过', () => {
    expect(validatePollOptions([{ text: 'A' }, { text: 'B' }]).valid).toBe(true)
  })

  it('少于 2 项返回 too-few', () => {
    expect(validatePollOptions([{ text: 'A' }]).reason).toBe('too-few')
  })

  it('空文本返回 empty + emptyIndex', () => {
    const r = validatePollOptions([{ text: 'A' }, { text: '   ' }])
    expect(r.valid).toBe(false)
    expect(r.reason).toBe('empty')
    expect(r.emptyIndex).toBe(1)
  })

  it('重复文本返回 duplicate + duplicateText', () => {
    const r = validatePollOptions([{ text: 'A' }, { text: 'A' }])
    expect(r.valid).toBe(false)
    expect(r.reason).toBe('duplicate')
    expect(r.duplicateText).toBe('A')
  })
})

describe('content-logic: validateMessageBody', () => {
  it('200 字符通过', () => {
    expect(validateMessageBody('a'.repeat(200)).valid).toBe(true)
  })

  it('201 字符失败 + overflow=1', () => {
    const r = validateMessageBody('a'.repeat(201))
    expect(r.valid).toBe(false)
    expect(r.overflow).toBe(1)
  })

  it('空文本通过', () => {
    expect(validateMessageBody('').valid).toBe(true)
  })
})

describe('content-logic: mediaTypeLabel / contentTypeLabel / summarize', () => {
  it('mediaTypeLabel 返回中文', () => {
    expect(mediaTypeLabel('image')).toBe('图片')
    expect(mediaTypeLabel('video')).toBe('视频')
    expect(mediaTypeLabel('audio')).toBe('音频')
  })

  it('contentTypeLabel 返回中文', () => {
    expect(contentTypeLabel('article')).toBe('文章')
    expect(contentTypeLabel('message')).toBe('短消息')
    expect(contentTypeLabel('poll')).toBe('投票')
  })

  it('summarize 短文本不截断', () => {
    expect(summarize('短文本', 10)).toBe('短文本')
  })

  it('summarize 超长截断并加省略号', () => {
    const out = summarize('a'.repeat(100), 10)
    expect(out.length).toBe(11) // 10 个 a + 1 个省略号
    expect(out.startsWith('a'.repeat(10))).toBe(true)
    expect(out.endsWith('…')).toBe(true)
  })

  it('summarize 处理 HTML', () => {
    expect(summarize('<p>hello</p>', 60)).toBe('hello')
  })
})
