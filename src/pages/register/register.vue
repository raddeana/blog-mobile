<template>
  <view class="page">
    <!-- 返回登录 -->
    <view class="back-btn" hover-class="back-hover" :hover-stay-time="80" @tap="goLogin">
      <view class="back-arrow" />
    </view>

    <!-- 背景光斑 -->
    <view class="orb orb-1" />
    <view class="orb orb-2" />
    <view class="orb orb-3" />
    <!-- 星星点缀 -->
    <view
      v-for="(s, i) in stars"
      :key="i"
      class="star"
      :style="{
        top: s.top,
        left: s.left,
        width: s.size + 'px',
        height: s.size + 'px',
        animationDelay: s.delay + 's',
        animationDuration: s.duration + 's'
      }"
    />

    <view class="content">
      <!-- 默认头像 -->
      <view class="logo-wrap">
        <view class="avatar-default">
          <view class="avatar-head" />
          <view class="avatar-body" />
        </view>
      </view>

      <text class="title">创建账号</text>
      <text class="subtitle">加入博客单，遇见更多精彩</text>

      <!-- 表单卡片 -->
      <view class="card">
        <!-- 用户名 -->
        <view class="input-row" :class="{ focused: focusField === 'username' }">
          <view class="icon-badge">
            <view class="ic-user">
              <view class="ic-user-head" />
              <view class="ic-user-body" />
            </view>
          </view>
          <input
            v-model="form.username"
            class="input"
            type="text"
            maxlength="20"
            placeholder="请输入用户名（3-20 字符）"
            placeholder-style="color: rgba(255,255,255,0.35)"
            @focus="focusField = 'username'"
            @blur="focusField = ''"
          />
        </view>

        <!-- 昵称 -->
        <view class="input-row" :class="{ focused: focusField === 'nickname' }">
          <view class="icon-badge">
            <view class="ic-smile">
              <view class="smile-face" />
              <view class="smile-eye smile-eye-l" />
              <view class="smile-eye smile-eye-r" />
              <view class="smile-mouth" />
            </view>
          </view>
          <input
            v-model="form.nickname"
            class="input"
            type="text"
            maxlength="20"
            placeholder="请输入昵称"
            placeholder-style="color: rgba(255,255,255,0.35)"
            @focus="focusField = 'nickname'"
            @blur="focusField = ''"
          />
        </view>

        <!-- 密码 -->
        <view class="input-row" :class="{ focused: focusField === 'password' }">
          <view class="icon-badge">
            <view class="ic-lock">
              <view class="ic-lock-shackle" />
              <view class="ic-lock-body">
                <view class="ic-lock-hole" />
              </view>
            </view>
          </view>
          <input
            v-model="form.password"
            class="input"
            :password="!showPwd"
            maxlength="32"
            placeholder="请输入密码（至少 6 位）"
            placeholder-style="color: rgba(255,255,255,0.35)"
            @focus="focusField = 'password'"
            @blur="focusField = ''"
          />
          <view class="eye-btn" hover-class="eye-hover" :hover-stay-time="80" @tap="showPwd = !showPwd">
            <view class="ic-eye" :class="{ closed: showPwd }">
              <view class="ic-eye-outline" />
              <view class="ic-eye-pupil" />
              <view class="ic-eye-slash" />
            </view>
          </view>
        </view>

        <!-- 确认密码 -->
        <view class="input-row" :class="{ focused: focusField === 'confirmPassword' }">
          <view class="icon-badge">
            <view class="ic-shield">
              <view class="shield-box" />
              <view class="shield-check" />
            </view>
          </view>
          <input
            v-model="form.confirmPassword"
            class="input"
            :password="!showPwd2"
            maxlength="32"
            placeholder="请再次输入密码"
            placeholder-style="color: rgba(255,255,255,0.35)"
            @focus="focusField = 'confirmPassword'"
            @blur="focusField = ''"
          />
          <view class="eye-btn" hover-class="eye-hover" :hover-stay-time="80" @tap="showPwd2 = !showPwd2">
            <view class="ic-eye" :class="{ closed: showPwd2 }">
              <view class="ic-eye-outline" />
              <view class="ic-eye-pupil" />
              <view class="ic-eye-slash" />
            </view>
          </view>
        </view>

        <!-- 邮箱 -->
        <view class="input-row" :class="{ focused: focusField === 'email' }">
          <view class="icon-badge">
            <view class="ic-mail">
              <view class="mail-body" />
              <view class="mail-flap" />
            </view>
          </view>
          <input
            v-model="form.email"
            class="input"
            type="text"
            placeholder="请输入邮箱"
            placeholder-style="color: rgba(255,255,255,0.35)"
            @focus="focusField = 'email'"
            @blur="focusField = ''"
          />
        </view>

        <!-- 协议 -->
        <view class="agreement">
          <view class="check" @tap="agree = !agree">
            <view class="checkbox" :class="{ checked: agree }">
              <text v-if="agree" class="check-mark">✓</text>
            </view>
          </view>
          <view class="agreement-text">
            <text>我已阅读并同意</text>
            <text class="link">《用户协议》</text>
            <text>和</text>
            <text class="link">《隐私政策》</text>
          </view>
        </view>

        <!-- 注册按钮 -->
        <view class="btn-wrap">
          <view
            class="btn-register"
            :class="{ clicking, loading: loading }"
            hover-class="btn-hover"
            :hover-stay-time="80"
            @tap="onRegisterTap"
          >
            <text class="btn-text">{{ loading ? '注 册 中...' : '注 册' }}</text>
          </view>
          <!-- 粒子爆发层：8 向彩色光点飞散（数组遍历，避免数字 v-for 的编译器兼容问题） -->
          <view v-if="burstKey > 0" :key="burstKey" class="btn-burst">
            <view
              v-for="i in rayIndexes"
              :key="i"
              class="ray"
              :class="'ray' + i"
            >
              <view class="particle" :class="['pc' + (i % 4), i % 2 === 0 ? 'pt-near' : 'pt-far']" />
            </view>
          </view>
        </view>
      </view>

      <!-- 去登录 -->
      <view class="login-row">
        <text class="gray-text">已有账号？</text>
        <text class="link" @tap="goLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  email: ''
})
const showPwd = ref(false)
const showPwd2 = ref(false)
const agree = ref(false)
const focusField = ref('')
const loading = ref(false)
const burstKey = ref(0)
/** 8 条粒子射线方向索引 */
const rayIndexes = [1, 2, 3, 4, 5, 6, 7, 8]
const clicking = ref(false)
let popTimer: ReturnType<typeof setTimeout> | null = null

const stars = [
  { top: '12%', left: '18%', size: 2, delay: 0, duration: 2.4 },
  { top: '22%', left: '78%', size: 3, delay: 0.6, duration: 3 },
  { top: '38%', left: '8%', size: 2, delay: 1.2, duration: 2.8 },
  { top: '8%', left: '55%', size: 2, delay: 0.3, duration: 2.2 },
  { top: '55%', left: '90%', size: 2, delay: 0.9, duration: 2.6 },
  { top: '70%', left: '12%', size: 3, delay: 1.5, duration: 3.2 }
]

function toast(title: string) {
  uni.showToast({ title, icon: 'none' })
}

/** 点击动效：粒子爆发 + 渐变涌动 + 过冲回弹，然后执行注册逻辑 */
function onRegisterTap() {
  if (loading.value) return
  burstKey.value++
  clicking.value = false
  setTimeout(() => { clicking.value = true }, 30)
  if (popTimer) clearTimeout(popTimer)
  popTimer = setTimeout(() => { clicking.value = false }, 750)
  onRegister()
}

function onRegister() {
  const username = form.username.trim()
  const nickname = form.nickname.trim()
  const email = form.email.trim()
  if (!username) return toast('请输入用户名')
  if (username.length < 3) return toast('用户名至少 3 个字符')
  if (!nickname) return toast('请输入昵称')
  if (!form.password) return toast('请输入密码')
  if (form.password.length < 6) return toast('密码至少 6 位')
  if (form.confirmPassword !== form.password) return toast('两次输入的密码不一致')
  if (!email) return toast('请输入邮箱')
  if (!/^[\w.%+-]+@[\w-]+(\.[\w-]+)+$/.test(email)) return toast('邮箱格式不正确')
  if (!agree.value) return toast('请先阅读并同意相关协议')

  loading.value = true
  uni.showLoading({ title: '注册中...' })
  // TODO: 替换为真实注册接口
  setTimeout(() => {
    uni.hideLoading()
    loading.value = false
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack({
        fail: () => uni.reLaunch({ url: '/pages/login/login' })
      })
    }, 1200)
  }, 1200)
}

function goLogin() {
  uni.navigateBack({
    fail: () => uni.reLaunch({ url: '/pages/login/login' })
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(160deg, #2b1a5e 0%, #1a103a 45%, #241040 100%);
  position: relative;
  overflow: hidden;
}

/* ---- 背景光斑 ---- */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(0);
  opacity: 0.55;
  animation: orb-float 9s ease-in-out infinite;

  &-1 {
    width: 420rpx;
    height: 420rpx;
    top: -100rpx;
    left: -120rpx;
    background: radial-gradient(circle at 35% 35%, rgba($focus-purple, 0.55), rgba($focus-purple, 0) 68%);
  }

  &-2 {
    width: 360rpx;
    height: 360rpx;
    top: 30%;
    right: -140rpx;
    background: radial-gradient(circle at 60% 40%, rgba($brand-pink, 0.45), rgba($brand-pink, 0) 68%);
    animation-delay: 2.6s;
  }

  &-3 {
    width: 460rpx;
    height: 460rpx;
    bottom: -140rpx;
    left: 22%;
    background: radial-gradient(circle at 50% 45%, rgba(91, 124, 255, 0.4), rgba(91, 124, 255, 0) 70%);
    animation-delay: 5s;
  }
}
@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(24rpx, -30rpx) scale(1.08); }
}

/* ---- 星星 ---- */
.star {
  position: absolute;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0.7;
  animation: twinkle 2.6s ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50% { opacity: 0.9; transform: scale(1.15); }
}

/* ---- 返回按钮 ---- */
.back-btn {
  @include flex-center;
  position: fixed;
  top: calc(var(--status-bar-height) + 20rpx);
  left: 30rpx;
  z-index: 10;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
}
.back-hover {
  background: rgba(255, 255, 255, 0.16);
  transform: scale(0.92);
}
.back-arrow {
  width: 18rpx;
  height: 18rpx;
  border-left: 4rpx solid $white-90;
  border-bottom: 4rpx solid $white-90;
  transform: rotate(45deg);
  margin-left: 8rpx;
}

/* ---- 内容区 ---- */
.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--status-bar-height) + 60rpx) 44rpx calc(60rpx + env(safe-area-inset-bottom));
}

/* ---- 默认头像：渐变底座 + 人形剪影（肩部贴合圆底裁切） ---- */
.logo-wrap {
  width: 168rpx;
  height: 168rpx;
  border-radius: 50%;
  padding: 6rpx;
  margin-top: 40rpx;
  background: linear-gradient(135deg, $brand-purple, $brand-pink);
  box-shadow: 0 12rpx 48rpx rgba($brand-purple, 0.55);
}
.avatar-default {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: $avatar-gradient;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}
.avatar-head {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
}
.avatar-body {
  width: 116rpx;
  height: 50rpx;
  margin-top: 8rpx;
  border-radius: 58rpx 58rpx 0 0;
  background: rgba(255, 255, 255, 0.96);
}

.title {
  margin-top: 36rpx;
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 4rpx;
  background: $title-gradient;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  margin-top: 14rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 2rpx;
}

/* ---- 表单卡片 ---- */
.card {
  width: 100%;
  margin-top: 48rpx;
  padding: 48rpx 40rpx;
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.07);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.35);
}

/* ---- 输入行（聚焦态：Vue class + :focus-within 双保险） ---- */
.input-row {
  display: flex;
  align-items: center;
  height: 100rpx;
  margin-bottom: 24rpx;
  padding: 0 24rpx;
  border-radius: 26rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  transition: all 0.25s ease;

  &.focused,
  &:focus-within {
    border-color: rgba($focus-purple, 0.9);
    background: rgba(255, 255, 255, 0.12);
    animation: focus-zap 0.45s ease-out, border-pulse 1.8s ease-in-out 0.45s infinite;
  }
}
/* 聚焦瞬间：白光点亮 + 光环从内扩散 */
@keyframes focus-zap {
  0% {
    border-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 0 rgba($focus-purple, 0.5), 0 0 0 rgba($brand-purple, 0);
  }
  100% {
    border-color: rgba($focus-purple, 0.9);
    box-shadow: 0 0 0 6rpx rgba($focus-ring, 0.18), 0 0 18rpx rgba($brand-purple, 0.35);
  }
}
/* 持续呼吸：边框紫 ↔ 粉流转，光晕同步呼吸 */
@keyframes border-pulse {
  0%, 100% {
    border-color: rgba($focus-purple, 0.9);
    box-shadow: 0 0 0 6rpx rgba($focus-ring, 0.18), 0 0 18rpx rgba($brand-purple, 0.35);
  }
  50% {
    border-color: rgba($brand-pink, 0.95);
    box-shadow: 0 0 0 6rpx rgba($brand-pink, 0.2), 0 0 22rpx rgba($brand-pink, 0.4);
  }
}

/* ---- 输入框图标底座 ---- */
.icon-badge {
  @include flex-center;
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  background: $icon-badge-gradient;
  border: 1rpx solid rgba(255, 255, 255, 0.18);
}

/* ---- 用户图标（头 + 肩身） ---- */
.ic-user {
  width: 30rpx;
  height: 30rpx;

  &-head {
    width: 12rpx;
    height: 12rpx;
    margin: 0 auto;
    border-radius: 50%;
    background: #ffffff;
  }

  &-body {
    width: 24rpx;
    height: 13rpx;
    margin: 3rpx auto 0;
    border-radius: 12rpx 12rpx 5rpx 5rpx;
    background: #ffffff;
  }
}

/* ---- 昵称图标（笑脸） ---- */
.ic-smile {
  position: relative;
  width: 30rpx;
  height: 30rpx;

  .smile-face {
    width: 30rpx;
    height: 30rpx;
    border: 3rpx solid #ffffff;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .smile-eye {
    position: absolute;
    top: 9rpx;
    width: 4rpx;
    height: 4rpx;
    border-radius: 50%;
    background: #ffffff;

    &-l {
      left: 8rpx;
    }

    &-r {
      right: 8rpx;
    }
  }

  .smile-mouth {
    position: absolute;
    bottom: 6rpx;
    left: 50%;
    width: 12rpx;
    height: 7rpx;
    margin-left: -6rpx;
    border-left: 3rpx solid #ffffff;
    border-right: 3rpx solid #ffffff;
    border-bottom: 3rpx solid #ffffff;
    border-radius: 0 0 14rpx 14rpx;
    box-sizing: border-box;
  }
}

/* ---- 锁图标（锁环 + 锁体 + 锁孔） ---- */
.ic-lock {
  width: 28rpx;
  height: 32rpx;

  &-shackle {
    box-sizing: border-box;
    width: 16rpx;
    height: 13rpx;
    margin: 0 auto;
    border: 4rpx solid #ffffff;
    border-bottom: none;
    border-radius: 10rpx 10rpx 0 0;
  }

  &-body {
    position: relative;
    width: 26rpx;
    height: 18rpx;
    margin: 0 auto;
    border-radius: 5rpx;
    background: #ffffff;
  }

  &-hole {
    position: absolute;
    top: 4rpx;
    left: 50%;
    width: 6rpx;
    height: 9rpx;
    margin-left: -3rpx;
    border-radius: 3rpx;
    background: $dark-purple-base;
  }
}

/* ---- 确认密码图标（盾牌勾选） ---- */
.ic-shield {
  position: relative;
  width: 28rpx;
  height: 28rpx;

  .shield-box {
    width: 28rpx;
    height: 28rpx;
    border: 3rpx solid #ffffff;
    border-radius: 9rpx;
    box-sizing: border-box;
  }

  .shield-check {
    position: absolute;
    top: 8rpx;
    left: 8rpx;
    width: 12rpx;
    height: 7rpx;
    border-left: 3rpx solid #ffffff;
    border-bottom: 3rpx solid #ffffff;
    transform: rotate(-45deg);
  }
}

/* ---- 邮箱图标（信封） ---- */
.ic-mail {
  position: relative;
  width: 30rpx;
  height: 22rpx;

  .mail-body {
    width: 30rpx;
    height: 22rpx;
    border-radius: 4rpx;
    background: #ffffff;
  }

  .mail-flap {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 0;
    margin-left: -11rpx;
    border-left: 11rpx solid transparent;
    border-right: 11rpx solid transparent;
    border-top: 11rpx solid rgba($dark-purple, 0.55);
  }
}

/* ---- 密码可见切换（眼睛） ---- */
.eye-btn {
  padding: 10rpx;
}
.eye-hover {
  opacity: 0.6;
  transform: scale(0.9);
}
.ic-eye {
  position: relative;
  width: 36rpx;
  height: 24rpx;

  &-outline {
    box-sizing: border-box;
    width: 34rpx;
    height: 22rpx;
    margin: 1rpx auto 0;
    border: 3rpx solid $white-90;
    border-radius: 50%;
  }

  &-pupil {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10rpx;
    height: 10rpx;
    margin: -4rpx 0 0 -5rpx;
    border-radius: 50%;
    background: #ffffff;
    transition: opacity 0.2s ease;
  }

  &-slash {
    display: none;
    position: absolute;
    top: -3rpx;
    left: 50%;
    width: 4rpx;
    height: 30rpx;
    margin-left: -2rpx;
    border-radius: 2rpx;
    background: $brand-pink;
    transform: rotate(40deg);
  }

  &.closed &-pupil {
    opacity: 0.25;
  }

  &.closed &-slash {
    display: block;
  }
}

.input {
  flex: 1;
  height: 100rpx;
  font-size: 30rpx;
  color: #ffffff;
}

/* ---- 协议 ---- */
.agreement {
  display: flex;
  align-items: center;
  margin: 8rpx 0 32rpx;

  .check {
    padding: 14rpx;
    margin-left: -14rpx;
  }

  .checkbox {
    @include flex-center;
    width: 30rpx;
    height: 30rpx;
    border-radius: 8rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.35);
    transition: all 0.2s ease;

    &.checked {
      background: linear-gradient(135deg, $brand-purple, $brand-pink);
      border-color: transparent;
    }
  }

  .check-mark {
    font-size: 20rpx;
    color: #ffffff;
    font-weight: 700;
  }

  .agreement-text {
    margin-left: 6rpx;
    font-size: 24rpx;
    color: $white-50;
    display: flex;
    align-items: center;
  }

  .link {
    color: $brand-light-purple;
  }
}

/* ---- 注册按钮（循环流光 + 点击动效） ---- */
.btn-wrap {
  position: relative;
}
.btn-register {
  @include flex-center;
  position: relative;
  overflow: hidden;
  height: 100rpx;
  border-radius: 50rpx;
  background: $button-gradient;
  box-shadow: 0 16rpx 40rpx rgba($focus-ring, 0.45);

  /* 循环流光 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -60%;
    width: 40%;
    height: 100%;
    background: linear-gradient(105deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0) 100%);
    transform: skewX(-20deg);
    animation: shine 2.8s ease-in-out infinite;
  }

  /* 加载中 */
  &.loading {
    opacity: 0.85;
  }

  /* 点击：过冲回弹 + 渐变涌动 */
  &.clicking {
    animation: btn-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), btn-flow 0.7s ease-out;
  }
}
.btn-hover {
  transform: scale(0.97);
}
.btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 6rpx;
}
@keyframes shine {
  0% { left: -60%; }
  55%, 100% { left: 130%; }
}
@keyframes btn-pop {
  0% { transform: scale(1); }
  25% { transform: scale(0.9); }
  65% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes btn-flow {
  0% { background-size: 100% 100%; background-position: 0% 0%; }
  40% { background-size: 260% 100%; background-position: 100% 0%; }
  100% { background-size: 100% 100%; background-position: 0% 0%; }
}

/* ---- 点击动效：8 向彩色粒子爆发 ---- */
.btn-burst {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}
.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
}
/* 8 条射线按 45° 均分生成 */
@for $i from 1 through 8 {
  .ray#{$i} {
    transform: rotate(($i - 1) * 45deg);
  }
}
.particle {
  position: absolute;
  top: 0;
  left: 0;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  box-shadow: 0 0 12rpx currentColor;
}
/* 四色粒子 */
.pc0 { background: $brand-pink; color: $brand-pink; }
.pc1 { background: $brand-purple; color: $brand-purple; }
.pc2 { background: $brand-blue; color: $brand-blue; }
.pc3 { background: $brand-gold; color: $brand-gold; }
.pt-far {
  animation: burst-far 0.7s cubic-bezier(0.15, 0.85, 0.4, 1) forwards;
}
.pt-near {
  animation: burst-near 0.7s cubic-bezier(0.15, 0.85, 0.4, 1) 0.04s forwards;
}
@keyframes burst-far {
  0% { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) translateY(-170rpx) scale(0.25); opacity: 0; }
}
@keyframes burst-near {
  0% { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) translateY(-110rpx) scale(0.25); opacity: 0; }
}

/* ---- 去登录 ---- */
.login-row {
  margin-top: 36rpx;
  display: flex;
  align-items: center;

  .link {
    font-size: 26rpx;
    font-weight: 600;
    color: $brand-light-purple;
    padding: 10rpx;
  }
}
.gray-text {
  font-size: 26rpx;
  color: $white-50;
}
</style>
