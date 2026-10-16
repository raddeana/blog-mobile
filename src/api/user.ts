/**
 * 用户资料 API 层
 * 预留真实接口调用位置，当前使用 mock 数据
 */

/* ---- 类型定义 ---- */

/** 用户资料（avatarUrl 为空表示使用默认 CSS 头像） */
export interface UserProfile {
  id: number
  nickname: string
  bio: string // 自我描述，可为空
  avatarUrl: string | null
}

export interface UpdateProfileInput {
  nickname?: string
  bio?: string
  avatarUrl?: string | null
}

/* ---- Mock 数据 ---- */

const mockUser: UserProfile = {
  id: 0,
  nickname: '博客单用户',
  bio: '',
  avatarUrl: null,
}

/* ---- API 函数 ---- */

/**
 * 获取当前用户资料
 * TODO: 替换为真实接口调用
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  // TODO: const res = await uni.request({ url: '/api/user/profile' })
  await new Promise(resolve => setTimeout(resolve, 400))
  return { ...mockUser }
}

/**
 * 更新当前用户资料
 * TODO: 替换为真实接口调用
 */
export async function updateUserProfile(input: UpdateProfileInput): Promise<UserProfile> {
  // TODO: await uni.request({ url: '/api/user/profile', method: 'PUT', data: input })
  await new Promise(resolve => setTimeout(resolve, 300))
  if (input.nickname !== undefined) mockUser.nickname = input.nickname
  if (input.bio !== undefined) mockUser.bio = input.bio
  if (input.avatarUrl !== undefined) mockUser.avatarUrl = input.avatarUrl
  return { ...mockUser }
}

/**
 * mock 上传头像，返回可访问的图片地址
 * TODO: 替换为真实接口调用
 */
export async function uploadAvatar(filePath: string): Promise<string> {
  // TODO: const res = await uni.uploadFile({ url: '/api/upload/avatar', filePath })
  await new Promise(resolve => setTimeout(resolve, 200))
  return filePath
}
