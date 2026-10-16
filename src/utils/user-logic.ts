/**
 * 用户设置纯函数：校验与展示工具（无副作用，可单测）
 */

/** 昵称最大字符数 */
export const NICKNAME_MAX = 20

/** 自我描述最大字符数 */
export const BIO_MAX = 100

/** 空简介展示占位文案 */
export const BIO_PLACEHOLDER = '这个人很懒，什么都没留下'

/** 昵称校验：非空且不超过上限，返回错误信息或 null */
export function validateNickname(name: string): string | null {
  const v = name.trim()
  if (!v) return '昵称不能为空'
  if (v.length > NICKNAME_MAX) return `昵称不能超过 ${NICKNAME_MAX} 个字符`
  return null
}

/** 简介校验：可为空但不超过上限，返回错误信息或 null */
export function validateBio(bio: string): string | null {
  if (bio.length > BIO_MAX) return `简介不能超过 ${BIO_MAX} 个字符`
  return null
}

/** 展示用简介：空简介回退为占位文案 */
export function displayBio(bio: string): string {
  return bio.trim() || BIO_PLACEHOLDER
}
