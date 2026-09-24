<template>
<view class="input-row" :class="{ focused: inputFocused, }">
  <view class="icon-badge">
    <view class="ic-user" v-if="props.icon === 'user'">
      <view class="ic-user-head" />
      <view class="ic-user-body" />
    </view>
    <view class="ic-smile" v-if="props.icon === 'smile'">
      <view class="smile-face" />
      <view class="smile-eye smile-eye-l" />
      <view class="smile-eye smile-eye-r" />
      <view class="smile-mouth" />
    </view>
    <view class="ic-lock" v-if="props.icon === 'lock'">
      <view class="ic-lock-shackle" />
      <view class="ic-lock-body">
        <view class="ic-lock-hole" />
      </view>
    </view>
    <view class="ic-shield" v-if="props.icon === 'shield'">
      <view class="shield-box" />
      <view class="shield-check" />
    </view>
    <view class="ic-mail" v-if="props.icon === 'mail'">
      <view class="mail-body" />
      <view class="mail-flap" />
    </view>
    <view class="ic-key" v-if="props.icon === 'key'">
      <view class="key-ring" />
      <view class="key-shaft" />
      <view class="key-tooth" />
    </view>
  </view>
  <input
    v-model="vModel"
    class="input"
    type="text"
    :password="props.type === 'password' && !showPwd"
    :placeholder="props.placeholder"
    placeholder-style="color: rgba(255, 255, 255, 0.35)"
    @focus="inputFocused = true;"
    @blur="inputFocused = false;"
  />
  <view class="eye-btn" hover-class="eye-hover" :hover-stay-time="80" @tap="showPwd = !showPwd" v-if="props.type === 'password'">
    <view class="ic-eye" :class="{ closed: showPwd }">
      <view class="ic-eye-outline" />
      <view class="ic-eye-pupil" />
      <view class="ic-eye-slash" />
    </view>
  </view>
</view>
</template>

<script setup lang="ts">
import { ref, } from 'vue';

const props = defineProps<{
  type: string
  placeholder: string
  icon: string
}>();

const vModel = defineModel();

// 输入聚焦
const inputFocused = ref<boolean>(false);
// 显示密码
const showPwd = ref(false);
</script>

<style lang="scss">
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

/* ---- 用户图标 ---- */
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

/* ---- 昵称图标 ---- */
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

/* ---- 验证码图标（钥匙：环 + 杆 + 齿） ---- */
.ic-key {
  position: relative;
  width: 30rpx;
  height: 14rpx;

  .key-ring {
    box-sizing: border-box;
    width: 14rpx;
    height: 14rpx;
    border: 3rpx solid #ffffff;
    border-radius: 50%;
  }

  .key-shaft {
    position: absolute;
    top: 5rpx;
    left: 13rpx;
    width: 14rpx;
    height: 4rpx;
    background: #ffffff;
  }

  .key-tooth {
    position: absolute;
    top: 9rpx;
    right: 1rpx;
    width: 4rpx;
    height: 6rpx;
    background: #ffffff;
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
</style>
