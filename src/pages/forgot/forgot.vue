<template>
  <view class="page">
    <!-- 返回登录 -->
    <view class="back-btn" hover-class="back-hover" :hover-stay-time="80" @tap="goBack">
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

      <text class="title">找回密码</text>
      <text class="subtitle">通过邮箱验证码重置密码</text>

      <!-- 步骤指示器 -->
      <view class="steps">
        <view class="step-dot" :class="{ active: step >= 1, done: step > 1 }">
          <view class="step-inner" />
        </view>
        <view class="step-line" :class="{ active: step > 1 }" />
        <view class="step-dot" :class="{ active: step >= 2, done: step > 2 }">
          <view class="step-inner" />
        </view>
        <view class="step-line" :class="{ active: step > 2 }" />
        <view class="step-dot" :class="{ active: step >= 3 }">
          <view class="step-inner" />
        </view>
      </view>
      <view class="step-labels">
        <text class="step-label" :class="{ cur: step === 1 }">验证邮箱</text>
        <text class="step-label" :class="{ cur: step === 2 }">输入验证码</text>
        <text class="step-label" :class="{ cur: step === 3 }">设置密码</text>
      </view>

      <!-- 表单卡片 -->
      <view class="card">
        <!-- Step 1：输入邮箱 + 发送验证码 -->
        <template v-if="step === 1">
          <beautiful-input v-model="form.email" type="text" icon="mail" placeholder="请输入注册邮箱" />
          <beautiful-button @tap="sendCode">
            <template #text>发送验证码</template>
          </beautiful-button>
        </template>

        <!-- Step 2：输入验证码 -->
        <template v-if="step === 2">
          <!-- 验证码行：图标 + 输入 + 发送按钮（带倒计时） -->
          <view class="input-row" :class="{ focused: codeFocused }">
            <view class="icon-badge">
              <view class="ic-key">
                <view class="key-ring" />
                <view class="key-shaft" />
                <view class="key-tooth" />
              </view>
            </view>
            <input
              v-model="form.code"
              class="input"
              type="number"
              maxlength="6"
              placeholder="请输入 6 位验证码"
              placeholder-style="color: rgba(255,255,255,0.35)"
              @focus="codeFocused = true"
              @blur="codeFocused = false"
            />
            <view
              class="send-btn"
              :class="{ disabled: countdown > 0 }"
              hover-class="send-hover"
              :hover-stay-time="80"
              @tap="resendCode"
            >
              <text class="send-text">{{ countdown > 0 ? countdown + 's' : '重新发送' }}</text>
            </view>
          </view>

          <beautiful-button @tap="verifyCode">
            <template #text>下一步</template>
          </beautiful-button>
        </template>

        <!-- Step 3：设置新密码 -->
        <template v-if="step === 3">
          <beautiful-input v-model="form.password" type="password" icon="lock" placeholder="请输入新密码（至少 6 位）" />
          <beautiful-input v-model="form.confirmPassword" type="password" icon="shield" placeholder="请再次输入新密码" />
          <beautiful-button @tap="resetPassword">
            <template #text>重置密码</template>
          </beautiful-button>
        </template>
      </view>

      <!-- 返回登录 -->
      <view class="login-row">
        <text class="gray-text">记起密码？</text>
        <text class="link" @tap="goBack">返回登录</text>
      </view>
    </view>
    <beautiful-background />
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue'

// 组件
import BeautifulBackground from '@/components/BeautifulBackground.vue';
import BeautifulButton from '@/components/BeautifulButton.vue';
import BeautifulInput from '@/components/BeautifulInput.vue';

const step = ref(1)
const countdown = ref(0)
const codeFocused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const form = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

function toast(title: string) {
  uni.showToast({ title, icon: 'none' })
}

/* ---- 倒计时 ---- */
function startCountdown() {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer) { clearInterval(timer); timer = null }
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

/* ---- Step 1：发送验证码 ---- */
function sendCode() {
  const email = form.email.trim()
  if (!email) return toast('请输入邮箱')
  if (!/^[\w.%+-]+@[\w-]+(\.[\w-]+)+$/.test(email)) return toast('邮箱格式不正确')

  uni.showLoading({ title: '发送中...', mask: true })
  // TODO: 替换为真实发送验证码接口
  setTimeout(() => {
    uni.hideLoading()
    startCountdown()
    step.value = 2
    uni.showToast({ title: '验证码已发送', icon: 'none' })
  }, 1000)
}

/* ---- Step 2：重新发送 ---- */
function resendCode() {
  if (countdown.value > 0) return
  const email = form.email.trim()
  if (!email) return toast('请输入邮箱')

  uni.showLoading({ title: '发送中...', mask: true })
  // TODO: 替换为真实重发接口
  setTimeout(() => {
    uni.hideLoading()
    startCountdown()
    uni.showToast({ title: '验证码已重新发送', icon: 'none' })
  }, 1000)
}

/* ---- Step 2：验证验证码 ---- */
function verifyCode() {
  if (!form.code.trim()) return toast('请输入验证码')
  if (form.code.trim().length !== 6) return toast('验证码为 6 位数字')

  uni.showLoading({ title: '验证中...', mask: true })
  // TODO: 替换为真实验证码校验接口
  setTimeout(() => {
    uni.hideLoading()
    step.value = 3
    uni.showToast({ title: '验证成功', icon: 'none' })
  }, 1000)
}

/* ---- Step 3：重置密码 ---- */
function resetPassword() {
  if (!form.password) return toast('请输入新密码')
  if (form.password.length < 6) return toast('密码至少 6 位')
  if (form.confirmPassword !== form.password) return toast('两次输入的密码不一致')

  uni.showLoading({ title: '重置中...', mask: true })
  // TODO: 替换为真实重置密码接口
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '密码重置成功', icon: 'success' })
    setTimeout(() => {
      goBack()
    }, 1200)
  }, 1000)
}

/* ---- 返回 ---- */
function goBack() {
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
  padding: 60rpx 64rpx 0;
}

/* ---- 默认头像 ---- */
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

/* ---- 步骤指示器 ---- */
.steps {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 40rpx;
}
.step-dot {
  @include flex-center;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 2rpx solid rgba(255, 255, 255, 0.25);
  transition: all 0.3s ease;

  &.active {
    background: $button-gradient;
    border-color: transparent;
    box-shadow: 0 6rpx 18rpx rgba($brand-purple, 0.4);
  }
  &.done {
    background: rgba($brand-purple, 0.6);
  }
}
.step-inner {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0.5;
}
.step-dot.active .step-inner {
  opacity: 1;
}
.step-line {
  width: 60rpx;
  height: 2rpx;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &.active {
    background: linear-gradient(90deg, $brand-purple, $brand-pink);
  }
}
.step-labels {
  display: flex;
  flex-direction: row;
  margin-top: 16rpx;
}
.step-label {
  width: 120rpx;
  text-align: center;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.35);

  &.cur {
    color: $brand-light-purple;
    font-weight: 600;
  }
}

/* ---- 表单卡片 ---- */
.card {
  width: 100%;
  margin-top: 40rpx;
  padding: 48rpx 40rpx;
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.07);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.35);
}

/* ---- 验证码发送按钮 ---- */
.send-btn {
  flex-shrink: 0;
  padding: 0 20rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28rpx;
  background: linear-gradient(135deg, rgba($brand-purple, 0.35), rgba($brand-pink, 0.25));
  border: 1rpx solid rgba($brand-purple, 0.4);

  &.disabled {
    opacity: 0.5;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
}
.send-hover {
  transform: scale(0.95);
  opacity: 0.85;
}
.send-text {
  font-size: 22rpx;
  color: $brand-light-purple;
  white-space: nowrap;
}

/* ---- 返回登录 ---- */
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
