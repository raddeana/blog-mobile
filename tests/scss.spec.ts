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

  it('&- 后缀嵌套正确展开为扁平类（光斑 orb-1/2/3）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.orb-1 {')
    expect(css).toContain('.orb-2 {')
    expect(css).toContain('.orb-3 {')
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

  it('结构嵌套生成后代选择器（笑脸图标 / 去登录链接 / 勾选态）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ic-smile .smile-eye-l')
    expect(css).toContain('.login-row .link')
    expect(css).toContain('.agreement .checkbox.checked')
  })

  it('信封图标深色折页使用深紫 rgba（回归：深紫变量派生）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('border-top: 11rpx solid rgba(52, 28, 110, 0.55)')
  })

  it('@for 循环生成 8 条粒子射线（与登录页共用设计）', () => {
    const { css } = compileScss(style)
    expect(css).toContain('.ray1 {')
    expect(css).toContain('rotate(315deg)')
  })

  it('光斑浮动 keyframes 声明存在', () => {
    const { css } = compileScss(style)
    expect(css).toContain('@keyframes orb-float')
  })
})
