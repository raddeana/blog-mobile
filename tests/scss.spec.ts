import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as sass from 'sass'

const root = resolve(fileURLToPath(import.meta.url), '../..')
const uniScss = readFileSync(resolve(root, 'src/uni.scss'), 'utf-8')

/** 与 uni-app 注入方式一致：每个 scss 块编译时前面都会带上 uni.scss 内容 */
function compileScss(source: string): sass.CompileResult {
  return sass.compileString(`${uniScss}\n${source}`, {
    silenceDeprecations: ['legacy-js-api', 'global-builtin'],
  })
}

/** 提取 .vue 文件中的 <style> 块源码 */
function extractStyle(relPath: string): string {
  const content = readFileSync(resolve(root, relPath), 'utf-8')
  const match = content.match(/<style[^>]*>([\s\S]*?)<\/style>/)
  if (!match) throw new Error(`${relPath} 中未找到 <style> 块`)
  return match[1]
}

describe('uni.scss 品牌设计变量', () => {
  it('本身只含编译期构造，不产生任何样式规则（注释除外）', () => {
    const result = compileScss('')
    const cssWithoutComments = result.css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/@charset\s+"[^"]*";/g, '')
      .trim()
    expect(cssWithoutComments).toBe('')
  })

  it('品牌色变量解析为正确色值', () => {
    const { css } = compileScss(
      `.t { color: $brand-purple; border-color: $brand-pink; background: $brand-magenta; }`
    )
    expect(css).toContain('color: #7b5cff')
    expect(css).toContain('border-color: #ff5c9d')
    expect(css).toContain('background: #b750ff')
  })

  it('渐变变量展开为完整 gradient（回归：$brand 系列被引用处全部解析）', () => {
    const { css } = compileScss(`.t { background: $button-gradient; }`)
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%)'
    )
  })

  it('深紫底色 rgba 解析正确（回归：dart-sass 不接受逗号颜色列表）', () => {
    const { css } = compileScss(
      `.t { color: $dark-purple-base; border-top: 11rpx solid rgba($dark-purple, 0.55); }`
    )
    expect(css).toContain('color: rgba(52, 28, 110, 0.85)')
    expect(css).toContain('border-top: 11rpx solid rgba(52, 28, 110, 0.55)')
  })

  it('flex-center 混入展开为完整居中布局', () => {
    const { css } = compileScss(`.t { @include flex-center; }`)
    expect(css).toContain('display: flex')
    expect(css).toContain('flex-direction: row')
    expect(css).toContain('align-items: center')
    expect(css).toContain('justify-content: center')
  })
})

describe('login.vue SCSS 样式块', () => {
  const style = extractStyle('src/pages/login/login.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('聚焦动效 keyframes（focus-zap / border-pulse）已声明', () => {
    const { css } = compileScss(style)
    expect(css).toContain('@keyframes focus-zap')
    expect(css).toContain('@keyframes border-pulse')
  })

  it('page 根选择器保留背景色（全局样式）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('page {')
    expect(css).toContain('background: #12062b')
  })

  it('@for 循环生成 8 条粒子射线且角度按 45° 均分', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ray1 {')
    expect(css).toContain('.ray8 {')
    expect(css).toContain('rotate(0deg)')
    expect(css).toContain('rotate(315deg)')
  })

  it('粒子颜色类输出四品牌色', () => {
    const { css } = compileScss(style)
    expect(css).toMatch(/\.pc0\s*\{[^}]*#ff5c9d/)
    expect(css).toMatch(/\.pc1\s*\{[^}]*#7b5cff/)
    expect(css).toMatch(/\.pc2\s*\{[^}]*#38bdf8/)
    expect(css).toMatch(/\.pc3\s*\{[^}]*#fbbf24/)
  })

  it('登录按钮使用品牌渐变与聚焦紫投影', () => {
    const { css } = compileScss(style)
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%)'
    )
    expect(css).toContain('rgba(150, 80, 255, 0.45)')
  })

  it('&.closed 复合嵌套生成 .ic-eye.closed 后代选择器', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-eye.closed .ic-eye-pupil')
    expect(css).toContain('.ic-eye.closed .ic-eye-slash')
  })

  it('点击动效与聚焦动效的关键 keyframes 均已声明', () => {
    const { css } = compileScss(style)
    for (const name of [
      '@keyframes focus-zap',
      '@keyframes border-pulse',
      '@keyframes btn-pop',
      '@keyframes btn-flow',
      '@keyframes burst-far',
      '@keyframes burst-near',
      '@keyframes shine',
    ]) {
      expect(css).toContain(name)
    }
  })

  it('嵌套 .link 生成 .register-row .link 后代选择器', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.register-row .link')
  })
})

describe('register.vue SCSS 样式块', () => {
  const style = extractStyle('src/pages/register/register.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('返回按钮箭头使用旋转绘制', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.back-arrow')
    expect(css).toContain('rotate(45deg)')
  })

  it('结构嵌套生成后代选择器（去登录链接 / 勾选态）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.login-row .link')
    expect(css).toContain('.agreement .checkbox.checked')
  })

  it('光斑浮动 keyframes 声明存在（BeautifulBackground 组件）', () => {
    const bgStyle = extractStyle('src/components/BeautifulBackground.vue')
    const { css } = compileScss(bgStyle)
    expect(css).toContain('@keyframes orb-float')
    expect(css).toContain('.orb-1')
    expect(css).toContain('.orb-2')
    expect(css).toContain('.orb-3')
  })

  it('@for 循环生成 8 条粒子射线（与登录页共用设计）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ray1 {')
    expect(css).toContain('rotate(315deg)')
  })

  it('信封图标深色折页使用深紫 rgba（BeautifulInput 组件）', () => {
    const inputStyle = extractStyle('src/components/BeautifulInput.vue')
    const { css } = compileScss(inputStyle)
    expect(css).toContain('border-top: 11rpx solid rgba(52, 28, 110, 0.55)')
  })
})

describe('forgot.vue SCSS 样式块', () => {
  const style = extractStyle('src/pages/forgot/forgot.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('返回按钮箭头使用 45° 旋转绘制（与注册页一致）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.back-arrow')
    expect(css).toContain('rotate(45deg)')
  })

  it('默认头像使用品牌渐变底座 + 人形剪影', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.avatar-default')
    expect(css).toContain('.avatar-head')
    expect(css).toContain('.avatar-body')
    expect(css).toContain(
      'linear-gradient(160deg, #8f6bff 0%, #b750ff 55%, #ff5c9d 100%)'
    )
  })

  it('标题使用 $title-gradient 渐变文字', () => {
    const { css } = compileScss(style)
    expect(css).toContain(
      'linear-gradient(90deg, #c7b6ff, #ffffff 40%, #ffb3d9)'
    )
  })

  it('步骤圆点 active 态使用品牌按钮渐变 + 紫投影', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.step-dot.active')
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%)'
    )
    expect(css).toContain('rgba(123, 92, 255, 0.4)')
  })

  it('步骤圆点 done 态使用半透明品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.step-dot.done')
    expect(css).toContain('rgba(123, 92, 255, 0.6)')
  })

  it('步骤连线 active 态使用紫粉渐变', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.step-line.active')
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff, #ff5c9d)'
    )
  })

  it('步骤标签 cur 态使用品牌浅紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.step-label.cur')
    expect(css).toContain('#b28bff')
  })

  it('验证码发送按钮使用品牌紫粉渐变背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.send-btn')
    expect(css).toContain('rgba(123, 92, 255, 0.35)')
    expect(css).toContain('rgba(255, 92, 157, 0.25)')
  })

  it('发送按钮 disabled 态降低透明度并切换中性背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.send-btn.disabled')
    expect(css).toContain('opacity: 0.5')
    expect(css).toContain('rgba(255, 255, 255, 0.08)')
  })

  it('发送按钮文字使用品牌浅紫色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.send-text')
    expect(css).toContain('color: #b28bff')
  })

  it('嵌套 .link 生成 .login-row .link 后代选择器', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.login-row .link')
  })
})

describe('BeautifulInput key 图标样式', () => {
  const style = extractStyle('src/components/BeautifulInput.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('钥匙图标包含环、杆、齿三个子元素', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-key')
    expect(css).toContain('.key-ring')
    expect(css).toContain('.key-shaft')
    expect(css).toContain('.key-tooth')
  })

  it('钥匙环为圆形边框', () => {
    const { css } = compileScss(style)
    expect(css).toMatch(/\.key-ring\s*\{[^}]*border-radius:\s*50%/)
    expect(css).toMatch(/\.key-ring\s*\{[^}]*border:\s*3rpx solid #ffffff/)
  })

  it('钥匙杆为白色实心矩形', () => {
    const { css } = compileScss(style)
    expect(css).toMatch(/\.key-shaft\s*\{[^}]*background:\s*#ffffff/)
  })
})

describe('CustomTabBar.vue 样式块', () => {
  const style = extractStyle('src/components/CustomTabBar.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('底部导航固定定位并适配 iPhone 安全区', () => {
    const { css } = compileScss(style)
    expect(css).toContain('position: fixed')
    expect(css).toContain('env(safe-area-inset-bottom)')
  })

  it('选中态标签使用品牌紫色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.tab-item.active .tab-label')
    expect(css).toContain('color: #7b5cff')
  })

  it('首页图标（房子）包含屋顶、墙体、门三个子元素', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-home')
    expect(css).toContain('.home-roof')
    expect(css).toContain('.home-body')
    expect(css).toContain('.home-door')
  })

  it('选中态首页图标颜色切换为品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.tab-item.active .ic-home')
    expect(css).toContain('border-bottom-color: #7b5cff')
  })

  it('我的图标（人形）包含头和身体', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-profile')
    expect(css).toContain('.pf-head')
    expect(css).toContain('.pf-body')
  })

  it('选中态我的图标颜色切换为品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.tab-item.active .ic-profile')
    expect(css).toContain('border-color: #7b5cff')
  })

  it('内容管理图标（文档+笔）包含 ct-doc/ct-line/ct-pencil/ct-tip 子元素', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-content')
    expect(css).toContain('.ct-doc')
    expect(css).toContain('.ct-line-1')
    expect(css).toContain('.ct-line-2')
    expect(css).toContain('.ct-pencil')
    expect(css).toContain('.ct-tip')
  })

  it('内容管理 tab 路径与标签已注册', () => {
    const raw = readFileSync(resolve(root, 'src/components/CustomTabBar.vue'), 'utf-8')
    expect(raw).toContain('/pages/content/content')
    expect(raw).toContain('管理')
  })

  it('选中态内容管理图标颜色切换为品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.tab-item.active .ic-content')
    expect(css).toContain('#7b5cff')
  })
})

describe('FeedCard.vue 样式块', () => {
  const style = extractStyle('src/components/FeedCard.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('卡片使用白色背景和圆角', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.feed-card')
    expect(css).toContain('background: #ffffff')
    expect(css).toContain('border-radius: 24rpx')
  })

  it('用户头像使用品牌渐变描边圆环', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.avatar-wrap')
    expect(css).toContain('linear-gradient(135deg, #7b5cff, #ff5c9d)')
    expect(css).toContain('.avatar-head')
    expect(css).toContain('.avatar-body')
  })

  it('关注按钮使用品牌紫渐变背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.follow-btn')
    expect(css).toContain('rgba(123, 92, 255, 0.1)')
    expect(css).toContain('rgba(255, 92, 157, 0.08)')
  })

  it('文章封面为渐变占位并包含圆形图标', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.article-cover')
    expect(css).toContain('.cover-icon')
    expect(css).toContain('border-radius: 50%')
  })

  it('投票徽章使用品牌紫粉渐变', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.poll-badge')
    expect(css).toContain('linear-gradient(135deg, #7b5cff, #ff5c9d)')
  })

  it('投票选项包含进度条和百分比', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.poll-bar')
    expect(css).toContain('.option-text')
    expect(css).toContain('.option-percent')
  })

  it('已投票选项边框高亮', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.poll-option.voted')
    expect(css).toContain('rgba(123, 92, 255, 0.5)')
  })

  it('心形图标包含两圆+方块三个子元素且点赞态填充品牌粉', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-heart')
    expect(css).toContain('.heart-l')
    expect(css).toContain('.heart-r')
    expect(css).toContain('.heart-b')
    expect(css).toContain('.ic-heart.liked .heart-l')
    expect(css).toContain('#ff5c9d')
  })

  it('评论图标包含气泡主体和尖尾', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-comment')
    expect(css).toContain('.comment-body')
    expect(css).toContain('.comment-tail')
  })

  it('转发图标包含水平线和箭头头', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-share')
    expect(css).toContain('.share-shaft')
    expect(css).toContain('.share-head')
  })
})

describe('index.vue 样式块', () => {
  const style = extractStyle('src/pages/index/index.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('页面背景使用浅灰色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('page {')
    expect(css).toContain('background: #f5f5f7')
  })

  it('顶部栏固定定位', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.topbar')
    expect(css).toContain('position: fixed')
  })

  it('Tab 选中态文字加粗加大', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.tab-item.active')
    expect(css).toContain('font-weight: 700')
    expect(css).toContain('font-size: 36rpx')
  })

  it('Tab 指示器使用品牌紫粉渐变', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.tab-indicator')
    expect(css).toContain('linear-gradient(90deg, #7b5cff, #ff5c9d)')
  })

  it('搜索图标包含圆圈和手柄', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-search')
    expect(css).toContain('.search-circle')
    expect(css).toContain('.search-handle')
  })

  it('加载点动画使用品牌紫色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.dot')
    expect(css).toContain('background: #7b5cff')
    expect(css).toContain('@keyframes dot-bounce')
  })

  it('空态图标使用半透明品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.empty-icon')
    expect(css).toContain('rgba(123, 92, 255, 0.2)')
  })
})

describe('profile.vue 样式块', () => {
  const style = extractStyle('src/pages/profile/profile.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('顶部区域使用深色品牌渐变背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.hero')
    expect(css).toContain(
      'linear-gradient(160deg, #2b1a5e 0%, #1a103a 45%, #241040 100%)'
    )
  })

  it('默认头像使用品牌渐变描边', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.logo-wrap')
    expect(css).toContain('linear-gradient(135deg, #7b5cff, #ff5c9d)')
  })

  it('统计数字使用白色字体', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.stat-num')
    expect(css).toContain('color: #ffffff')
  })

  it('菜单卡片白色背景圆角', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.menu-card')
    expect(css).toContain('background: #ffffff')
    expect(css).toContain('border-radius: 24rpx')
  })

  it('文章菜单图标使用品牌紫边框', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-article')
    expect(css).toContain('border: 3rpx solid #7b5cff')
  })

  it('图表菜单图标使用品牌粉', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-chart')
    expect(css).toContain('background: #ff5c9d')
  })

  it('星标菜单图标使用金色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-star')
    expect(css).toContain('background: #fbbf24')
  })

  it('齿轮菜单图标使用品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-gear')
    expect(css).toContain('border: 4rpx solid #7b5cff')
  })
})

describe('search.vue SCSS 样式块', () => {
  const style = extractStyle('src/pages/search/search.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('页面背景使用浅灰色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('page {')
    expect(css).toContain('background: #f5f5f7')
  })

  it('顶部导航栏 fixed 定位 + 白色背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.topbar')
    expect(css).toContain('position: fixed')
    expect(css).toContain('rgba(255, 255, 255, 0.96)')
  })

  it('返回箭头使用 45° 旋转绘制', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.back-arrow')
    expect(css).toContain('rotate(45deg)')
    expect(css).toContain('border-left: 4rpx solid #333')
  })

  it('搜索输入框圆角 + 浅灰背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.search-input-wrap')
    expect(css).toContain('background: #f0f0f2')
    expect(css).toContain('border-radius: 32rpx')
  })

  it('搜索图标包含圆圈和手柄', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-search')
    expect(css).toContain('.search-circle')
    expect(css).toContain('.search-handle')
  })

  it('搜索按钮使用品牌紫色文字', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.search-btn-text')
    expect(css).toContain('color: #7b5cff')
  })

  it('历史标签使用品牌紫边框 + 浅紫背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.history-tag')
    expect(css).toContain('rgba(123, 92, 255, 0.3)')
    expect(css).toContain('rgba(123, 92, 255, 0.06)')
  })

  it('热搜序号前三名使用品牌粉色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.hot-num.top')
    expect(css).toContain('color: #ff5c9d')
  })

  it('空态使用半透明品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.empty-icon')
    expect(css).toContain('rgba(123, 92, 255, 0.2)')
  })
})

describe('comment.vue SCSS 样式块', () => {
  const style = extractStyle('src/pages/comment/comment.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('页面背景使用浅灰色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('page {')
    expect(css).toContain('background: #f5f5f7')
  })

  it('顶部导航栏 fixed 定位', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.topbar')
    expect(css).toContain('position: fixed')
  })

  it('返回箭头使用 45° 旋转绘制（与搜索页一致）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.back-arrow')
    expect(css).toContain('rotate(45deg)')
    expect(css).toContain('border-left: 4rpx solid #333')
  })

  it('默认头像含 head/body + 品牌渐变底座', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.cm-avatar')
    expect(css).toContain('.cm-avatar-head')
    expect(css).toContain('.cm-avatar-body')
    expect(css).toContain(
      'linear-gradient(160deg, #8f6bff 0%, #b750ff 55%, #ff5c9d 100%)'
    )
  })

  it('评论项含 author/text/foot 结构', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.comment-item')
    expect(css).toContain('.comment-author')
    expect(css).toContain('.comment-text')
    expect(css).toContain('.comment-foot')
  })

  it('评论作者名使用品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.comment-author')
    expect(css).toContain('color: #7b5cff')
  })

  it('回复列表含左侧竖线 + 浅紫底', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.reply-list')
    expect(css).toContain('border-left')
    expect(css).toContain('rgba(123, 92, 255, 0.3)')
    expect(css).toContain('rgba(123, 92, 255, 0.04)')
  })

  it('心形点赞图标含两圆+方块三个子元素且点赞态填充品牌粉', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.cm-heart')
    expect(css).toContain('.cm-heart-l')
    expect(css).toContain('.cm-heart-r')
    expect(css).toContain('.cm-heart-b')
    expect(css).toContain('.cm-heart.liked')
    expect(css).toContain('#ff5c9d')
  })

  it('底部输入栏 fixed 定位并适配 iPhone 安全区', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.input-bar')
    expect(css).toContain('position: fixed')
    expect(css).toContain('env(safe-area-inset-bottom)')
  })

  it('发送按钮使用品牌紫粉渐变背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.send-btn')
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%)'
    )
  })

  it('发送按钮 disabled 态降低透明度', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.send-btn.disabled')
    expect(css).toContain('opacity: 0.5')
  })

  it('空态使用半透明品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.empty-icon')
    expect(css).toContain('rgba(123, 92, 255, 0.2)')
  })
})

/** 提取 .vue 文件中所有 <style> 块源码（用于含多个 style 块的页面） */
function extractAllStyles(relPath: string): string {
  const content = readFileSync(resolve(root, relPath), 'utf-8')
  const matches = content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)
  return Array.from(matches, m => m[1]).join('\n')
}

describe('detail.vue SCSS 样式块', () => {
  const style = extractAllStyles('src/pages/detail/detail.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('页面背景使用浅灰色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('page {')
    expect(css).toContain('background: #f5f5f7')
  })

  it('顶部导航栏 fixed 定位', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.topbar')
    expect(css).toContain('position: fixed')
  })

  it('返回箭头使用 45° 旋转绘制（与评论/搜索页一致）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.back-arrow')
    expect(css).toContain('rotate(45deg)')
    expect(css).toContain('border-left: 4rpx solid #333')
  })

  it('文章/短信息正文不截断（无 -webkit-line-clamp）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.article-body')
    expect(css).toContain('.message-text')
    expect(css).not.toContain('-webkit-line-clamp')
  })

  it('互动栏心形图标含两圆+方块且点赞态填充品牌粉', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-heart')
    expect(css).toContain('.heart-l')
    expect(css).toContain('.heart-r')
    expect(css).toContain('.heart-b')
    expect(css).toContain('.ic-heart.liked')
    expect(css).toContain('#ff5c9d')
  })

  it('默认头像含 head/body + 品牌渐变底座', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.cm-avatar')
    expect(css).toContain('.cm-avatar-head')
    expect(css).toContain('.cm-avatar-body')
    expect(css).toContain(
      'linear-gradient(160deg, #8f6bff 0%, #b750ff 55%, #ff5c9d 100%)'
    )
  })

  it('评论项含 author/text/foot 结构', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.comment-item')
    expect(css).toContain('.comment-author')
    expect(css).toContain('.comment-text')
    expect(css).toContain('.comment-foot')
  })

  it('评论作者名使用品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.comment-author')
    expect(css).toContain('color: #7b5cff')
  })

  it('回复列表含左侧竖线 + 浅紫底', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.reply-list')
    expect(css).toContain('border-left')
    expect(css).toContain('rgba(123, 92, 255, 0.3)')
    expect(css).toContain('rgba(123, 92, 255, 0.04)')
  })

  it('评论心形图标含两圆+方块三子元素且点赞态填充品牌粉', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.cm-heart')
    expect(css).toContain('.cm-heart-l')
    expect(css).toContain('.cm-heart-r')
    expect(css).toContain('.cm-heart-b')
    expect(css).toContain('.cm-heart.liked')
    expect(css).toContain('#ff5c9d')
  })

  it('底部输入栏 fixed 定位并适配 iPhone 安全区', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.input-bar')
    expect(css).toContain('position: fixed')
    expect(css).toContain('env(safe-area-inset-bottom)')
  })

  it('发送按钮使用品牌紫粉渐变背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.send-btn')
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%)'
    )
  })

  it('发送按钮 disabled 态降低透明度', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.send-btn.disabled')
    expect(css).toContain('opacity: 0.5')
  })

  it('空态使用半透明品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.empty-icon')
    expect(css).toContain('rgba(123, 92, 255, 0.2)')
  })
})

describe('content.vue SCSS 样式块', () => {
  const style = extractAllStyles('src/pages/content/content.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('页面背景使用浅灰色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('page {')
    expect(css).toContain('background: #f5f5f7')
  })

  it('顶部导航栏 fixed 定位', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.topbar')
    expect(css).toContain('position: fixed')
  })

  it('新建按钮使用品牌渐变背景', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.new-btn')
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%)'
    )
  })

  it('内容卡片白底圆角', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.content-card')
    expect(css).toContain('background: #ffffff')
    expect(css).toContain('border-radius: 24rpx')
  })

  it('三种类型徽章颜色区分（文章紫/短消息蓝紫/投票粉金）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.card-type-badge.article')
    expect(css).toContain('#7b5cff')
    expect(css).toContain('.card-type-badge.message')
    expect(css).toContain('#38bdf8')
    expect(css).toContain('.card-type-badge.poll')
    expect(css).toContain('#ff5c9d')
  })

  it('删除按钮使用品牌粉', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.delete-btn')
    expect(css).toContain('.delete-text')
    expect(css).toContain('color: #ff5c9d')
  })

  it('编辑按钮使用品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.edit-text')
    expect(css).toContain('color: #7b5cff')
  })

  it('空态使用半透明品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.empty-icon')
    expect(css).toContain('rgba(123, 92, 255, 0.2)')
  })
})

describe('editor.vue SCSS 样式块', () => {
  const style = extractAllStyles('src/pages/content/editor.vue')

  it('可被 dart-sass 无错编译', () => {
    expect(() => compileScss(style)).not.toThrow()
  })

  it('页面背景使用浅灰色', () => {
    const { css } = compileScss(style)
    expect(css).toContain('page {')
    expect(css).toContain('background: #f5f5f7')
  })

  it('顶部导航栏 fixed + 返回箭头 45° 旋转', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.topbar')
    expect(css).toContain('position: fixed')
    expect(css).toContain('.back-arrow')
    expect(css).toContain('rotate(45deg)')
    expect(css).toContain('border-left: 4rpx solid #333')
  })

  it('保存按钮使用品牌渐变 + disabled 态降低透明度', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.save-btn')
    expect(css).toContain(
      'linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%)'
    )
    expect(css).toContain('.save-btn.disabled')
    expect(css).toContain('opacity: 0.5')
  })

  it('类型选择器三段式 + active 态品牌紫', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.type-tab')
    expect(css).toContain('.type-tab.active')
    expect(css).toContain('color: #7b5cff')
  })

  it('富文本工具栏含 bold/italic/underline/image 四按钮', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.tb-btn.bold')
    expect(css).toContain('.tb-btn.italic')
    expect(css).toContain('.tb-btn.underline')
    expect(css).toContain('.tb-btn.image')
  })

  it('字数计数器超限态使用品牌粉', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.char-counter.overflow')
    expect(css).toContain('color: #ff5c9d')
  })

  it('投票选项编辑器含 add/remove 按钮', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.opt-add')
    expect(css).toContain('.opt-remove')
  })

  it('媒体网格 + 新增按钮', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.media-grid')
    expect(css).toContain('.media-add')
  })
})
