<template>
  <view class="page">
    <!-- 返回登录 -->
    <view class="back-btn" hover-class="back-hover" :hover-stay-time="80" @tap="goLogin">
      <view class="back-arrow" />
    </view>

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
        <beautiful-input v-model="form.username" type="text" icon="user" placeholder="请输入用户名（3-20 字符）" />
        <!-- 昵称 -->
        <beautiful-input v-model="form.nickname" type="text" icon="smile" placeholder="请输入昵称" />
        <!-- 密码 -->
        <beautiful-input v-model="form.password" type="password" icon="lock" placeholder="请输入密码（至少 6 位）" />
        <!-- 确认密码 -->
        <beautiful-input v-model="form.confirmPassword" type="password" icon="shield" placeholder="请再次输入密码" />
        <!-- 邮箱 -->
        <beautiful-input v-model="form.email" type="text" icon="mail" placeholder="请输入邮箱" />
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
        <beautiful-button @tap="onRegister">
          <template #text>注册</template>
        </beautiful-button>
      </view>

      <!-- 去登录 -->
      <view class="login-row">
        <text class="gray-text">已有账号？</text>
        <text class="link" @tap="goLogin">去登录</text>
      </view>
    </view>
    <beautiful-background />
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 组件
import BeautifulBackground from '@/components/BeautifulBackground.vue';
import BeautifulButton from '@/components/BeautifulButton.vue';
import BeautifulInput from '@/components/BeautifulInput.vue';

const form = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  email: ''
})

const agree = ref(false)
const loading = ref(false)

function toast(title: string) {
  uni.showToast({ title, icon: 'none' })
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
  height: 100vh;
  background: linear-gradient(160deg, #2b1a5e 0%, #1a103a 45%, #241040 100%);
  position: relative;
  overflow: hidden;
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
  padding: 60rpx 64rpx 0;
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
