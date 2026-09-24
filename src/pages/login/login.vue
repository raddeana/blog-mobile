<template>
  <view class="page">
    <view class="content">
      <!-- Logo -->
      <view class="logo-wrap">
        <!-- 头像：有图且加载成功显示图片；为空/加载中/失败时回退默认头像 -->
        <view v-if="!avatarUrl || avatarFailed || !avatarLoaded" class="avatar-default">
          <view class="avatar-head" />
          <view class="avatar-body" />
        </view>
        <image
          v-if="avatarUrl && !avatarFailed"
          class="avatar-img"
          :src="avatarUrl"
          mode="aspectFill"
          @load="avatarLoaded = true"
          @error="avatarFailed = true"
        />
      </view>

      <text class="title">欢迎回来</text>
      <text class="subtitle">登录博客单，遇见更多精彩</text>

      <!-- 表单卡片 -->
      <view class="card">
        <beautiful-input v-model="form.username" type="text" icon="user" placeholder="请输入账号 / 邮箱" />
        <beautiful-input v-model="form.password" type="password" icon="lock" placeholder="请输入密码" />
        <view class="row-between">
          <view class="check" @tap="remember = !remember">
            <view class="checkbox" :class="{ checked: remember }">
              <text v-if="remember" class="check-mark">✓</text>
            </view>
            <text class="check-text">记住我</text>
          </view>
          <text class="link" @tap="onForgot">忘记密码？</text>
        </view>

        <beautiful-button @tap="onLogin">
          <template #text>登录</template>
        </beautiful-button>

        <view class="register-row">
          <text class="gray-text">还没有账号？</text>
          <text class="link" @tap="onRegister">立即注册</text>
        </view>
      </view>

      <!-- 其他登录方式 -->
      <view class="divider">
        <view class="line" />
        <text class="divider-text">其他登录方式</text>
        <view class="line line-r" />
      </view>

      <view class="social-row">
        <view class="social-btn" hover-class="social-hover" @tap="onSocial('微信登录')">
          <view class="social-icon icon-wechat-bg">
            <view class="wc-bubble">
              <view class="wc-eye wc-eye-l" />
              <view class="wc-eye wc-eye-r" />
            </view>
          </view>
          <text class="social-label">微信</text>
        </view>
        <view class="social-btn" hover-class="social-hover" @tap="onSocial('手机验证码登录')">
          <view class="social-icon icon-phone-bg">
            <view class="ph-body">
              <view class="ph-dot" />
            </view>
          </view>
          <text class="social-label">手机</text>
        </view>
      </view>
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
    <beautiful-background />
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

// 组件
import BeautifulBackground from '@/components/BeautifulBackground.vue';
import BeautifulButton from '@/components/BeautifulButton.vue';
import BeautifulInput from '@/components/BeautifulInput.vue';

const form = reactive({ username: '', password: '' });
/** 用户头像：接入接口后赋值；为空、加载中或加载失败时显示默认头像 */
const avatarUrl = ref('');
const avatarLoaded = ref(false);
const avatarFailed = ref(false);

watch(avatarUrl, () => {
  avatarLoaded.value = false
  avatarFailed.value = false
});

const remember = ref(false)
const agree = ref(false)
const loading = ref(false)

function onForgot() {
  uni.navigateTo({ url: '/pages/forgot/forgot' })
}

function onRegister() {
  uni.navigateTo({ url: '/pages/register/register' })
}

function onSocial(name: string) {
  uni.showToast({ title: name + '开发中', icon: 'none' })
}

function onLogin() {
  if (!form.username.trim()) {
    uni.showToast({ title: '请输入账号', icon: 'none' })
    return
  }
  if (!form.password) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  if (!agree.value) {
    uni.showToast({ title: '请先阅读并同意相关协议', icon: 'none' })
    return
  }
  if (loading.value) return

  loading.value = true
  uni.showLoading({ title: '登录中...', mask: true })
  // TODO: 替换为真实登录接口
  setTimeout(() => {
    uni.hideLoading()
    loading.value = false
    if (remember.value) {
      uni.setStorageSync('username', form.username)
    }
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' })
    }, 600)
  }, 1200)
}
</script>

<style lang="scss">
/* 登录页样式：全局生效（page 选择器作用于页面根节点） */
page {
  background: #12062b;
}

.page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #20124d 0%, #14082f 40%, #2a0a3d 75%, #12062b 100%);
  padding-top: var(--status-bar-height);
}

/* ---- 主体 ---- */
.content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 48rpx 0;
}

/* Logo 头像：渐变描边圆环 */
.logo-wrap {
  width: 168rpx;
  height: 168rpx;
  border-radius: 50%;
  padding: 6rpx;
  margin-top: 40rpx;
  background: linear-gradient(135deg, $brand-purple, $brand-pink);
  box-shadow: 0 12rpx 48rpx rgba($brand-purple, 0.55);
}
/* 默认头像：渐变底座 + 人形剪影（肩部贴合圆底裁切） */
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
/* 用户头像图片（加载成功后覆盖默认头像） */
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
  margin-top: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 2rpx;
}

/* ---- 卡片 ---- */
.card {
  width: 100%;
  box-sizing: border-box;
  margin-top: 56rpx;
  padding: 48rpx 40rpx;
  background: rgba(255, 255, 255, 0.07);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  border-radius: 36rpx;
  box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.35);
}

/* ---- 输入行（聚焦态：Vue class + :focus-within 双保险） ---- */
.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
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

/* ---- 眼睛图标（轮廓 + 瞳孔 + 斜杠） ---- */
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

/* ---- 记住我 / 忘记密码 ---- */
.row-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 6rpx 4rpx 0;
}
.check {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.checkbox {
  @include flex-center;
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
  border-radius: 10rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.4);
  transition: all 0.2s ease;

  &.checked {
    background: linear-gradient(135deg, $brand-purple, $brand-pink);
    border-color: transparent;
  }
}
.check-mark {
  font-size: 22rpx;
  line-height: 1;
  color: #ffffff;
}
.check-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}
.link {
  font-size: 26rpx;
  color: $brand-light-purple;
}

/* ---- 登录按钮（循环流光 + 点击动效） ---- */
.btn-wrap {
  position: relative;
  margin-top: 44rpx;
}
.btn-login {
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
    transform: skewX(-20deg);
    background: linear-gradient(105deg, transparent, rgba(255, 255, 255, 0.35), transparent);
    animation: shine 2.8s ease-in-out infinite;
  }

  /* 点击：过冲回弹 + 渐变涌动 */
  &.clicking {
    animation: btn-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), btn-flow 0.7s ease-out;
  }
}
.btn-hover {
  transform: scale(0.97);
  opacity: 0.9;
}
.btn-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 12rpx;
}
@keyframes shine {
  0% { left: -60%; }
  60%, 100% { left: 120%; }
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

/* ---- 注册入口 ---- */
.register-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 36rpx;

  .link {
    margin-left: 8rpx;
  }
}
.gray-text {
  font-size: 26rpx;
  color: $white-50;
}

/* ---- 其他登录方式 ---- */
.divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 56rpx;
}
.line {
  flex: 1;
  height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25));

  &-r {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.25), transparent);
  }
}
.divider-text {
  margin: 0 24rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
}

.social-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 44rpx;
}
.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;

  & + & {
    margin-left: 160rpx;
  }
}
.social-icon {
  @include flex-center;
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
}
.icon-wechat-bg {
  background: linear-gradient(135deg, #2ee56b 0%, #07c160 100%);
  box-shadow: 0 10rpx 28rpx rgba(7, 193, 96, 0.35);
}
.icon-phone-bg {
  background: linear-gradient(135deg, #4f8cff 0%, $brand-purple 100%);
  box-shadow: 0 10rpx 28rpx rgba(96, 116, 255, 0.35);
}
.social-hover {
  transform: scale(0.92);
  opacity: 0.85;
}
.social-label {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.55);
}

/* ---- 微信图标（CSS 绘制：气泡 + 尾巴 + 双眼） ---- */
.wc-bubble {
  position: relative;
  width: 50rpx;
  height: 40rpx;
  background: #ffffff;
  border-radius: 50%;

  &::after {
    content: '';
    position: absolute;
    left: 7rpx;
    bottom: -5rpx;
    width: 14rpx;
    height: 14rpx;
    background: #ffffff;
    border-radius: 3rpx;
    transform: rotate(25deg);
  }
}
.wc-eye {
  position: absolute;
  top: 13rpx;
  width: 7rpx;
  height: 11rpx;
  border-radius: 50%;
  background: #07c160;

  &-l {
    left: 14rpx;
  }

  &-r {
    right: 14rpx;
  }
}

/* ---- 手机图标（CSS 绘制：机身 + 听筒 + 按键） ---- */
.ph-body {
  position: relative;
  width: 38rpx;
  height: 54rpx;
  border: 4rpx solid #ffffff;
  border-radius: 8rpx;

  /* 听筒 */
  &::after {
    content: '';
    position: absolute;
    top: 6rpx;
    left: 50%;
    width: 12rpx;
    height: 3rpx;
    margin-left: -6rpx;
    border-radius: 3rpx;
    background: $white-90;
  }
}
.ph-dot {
  position: absolute;
  bottom: 5rpx;
  left: 50%;
  width: 8rpx;
  height: 8rpx;
  margin-left: -4rpx;
  border-radius: 50%;
  background: $white-90;
}

/* ---- 协议 ---- */
.agreement {
  @include flex-center;
  position: relative;
  z-index: 1;
  padding: 30rpx 40rpx calc(30rpx + env(safe-area-inset-bottom));

  .checkbox {
    margin-right: 10rpx;
  }

  .agreement-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.45);

    .link {
      font-size: 22rpx;
    }
  }
}
</style>
