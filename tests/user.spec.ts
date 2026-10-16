import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  BIO_MAX,
  BIO_PLACEHOLDER,
  NICKNAME_MAX,
  displayBio,
  validateBio,
  validateNickname,
} from '../src/utils/user-logic'

const root = resolve(fileURLToPath(import.meta.url), '../..')

describe('user-logic: validateNickname', () => {
  it('合法昵称通过', () => {
    expect(validateNickname('博客单用户')).toBeNull()
    expect(validateNickname('  anemone  ')).toBeNull()
  })

  it('空白昵称拒绝（trim 后为空）', () => {
    expect(validateNickname('')).toBe('昵称不能为空')
    expect(validateNickname('   ')).toBe('昵称不能为空')
  })

  it('超长昵称拒绝', () => {
    expect(validateNickname('a'.repeat(NICKNAME_MAX + 1))).toBe(
      `昵称不能超过 ${NICKNAME_MAX} 个字符`
    )
    expect(validateNickname('a'.repeat(NICKNAME_MAX))).toBeNull()
  })
})

describe('user-logic: validateBio', () => {
  it('空简介合法（可为空）', () => {
    expect(validateBio('')).toBeNull()
  })

  it('上限内合法，超限拒绝', () => {
    expect(validateBio('b'.repeat(BIO_MAX))).toBeNull()
    expect(validateBio('b'.repeat(BIO_MAX + 1))).toBe(`简介不能超过 ${BIO_MAX} 个字符`)
  })
})

describe('user-logic: displayBio', () => {
  it('空简介回退为占位文案', () => {
    expect(displayBio('')).toBe(BIO_PLACEHOLDER)
    expect(displayBio('   ')).toBe(BIO_PLACEHOLDER)
  })

  it('非空简介原样返回', () => {
    expect(displayBio('热爱写代码')).toBe('热爱写代码')
  })
})

describe('设置功能页面接线', () => {
  it('个人页「设置」菜单跳转到设置页，且资料绑定 API 数据', () => {
    const raw = readFileSync(resolve(root, 'src/pages/profile/profile.nvue'), 'utf-8')
    expect(raw).toContain('/pages/profile/settings')
    expect(raw).toContain('fetchUserProfile')
    expect(raw).toContain('displayBio')
    // 头像已设置时展示图片
    expect(raw).toContain('<image v-if="avatarUrl"')
  })

  it('设置页保存链路完整：校验 → 上传头像 → 更新资料', () => {
    const raw = readFileSync(resolve(root, 'src/pages/profile/settings.nvue'), 'utf-8')
    expect(raw).toContain('validateNickname')
    expect(raw).toContain('validateBio')
    expect(raw).toContain('uploadAvatar')
    expect(raw).toContain('updateUserProfile')
    expect(raw).toContain('uni.chooseImage')
  })

  it('路由已注册且使用自定义导航', () => {
    const raw = readFileSync(resolve(root, 'src/pages.json'), 'utf-8')
    expect(raw).toContain('"pages/profile/settings"')
  })
})
