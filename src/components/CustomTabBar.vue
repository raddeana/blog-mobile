<template>
  <view class="tabbar">
    <view
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: current === tab.path }"
      hover-class="tab-hover"
      :hover-stay-time="80"
      @tap="switchTab(tab)"
    >
      <!-- 首页：房子图标 -->
      <view class="ic-home" v-if="tab.icon === 'home'">
        <view class="home-roof" />
        <view class="home-body" />
        <view class="home-door" />
      </view>
      <!-- 内容管理：文档+笔 -->
      <view class="ic-content" v-if="tab.icon === 'content'">
        <view class="ct-doc" />
        <view class="ct-line ct-line-1" />
        <view class="ct-line ct-line-2" />
        <view class="ct-pencil" />
        <view class="ct-tip" />
      </view>
      <!-- 我的：人形图标 -->
      <view class="ic-profile" v-if="tab.icon === 'profile'">
        <view class="pf-head" />
        <view class="pf-body" />
      </view>
      <text class="tab-label">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  current: string
}>()

const emit = defineEmits(['change'])

const tabs = ref([
  { path: '/pages/index/index', label: '首页', icon: 'home' },
  { path: '/pages/content/content', label: '管理', icon: 'content' },
  { path: '/pages/profile/profile', label: '我的', icon: 'profile' },
])

function switchTab(tab: { path: string; label: string; icon: string }) {
  if (props.current === tab.path) return
  emit('change', tab.path)
  uni.redirectTo({ url: tab.path })
}
</script>

<style lang="scss">
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: calc(100rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.95);
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  transition: all 0.2s ease;
}

.tab-hover {
  opacity: 0.7;
}

.tab-label {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: #999;
  transition: color 0.2s ease;
}

.tab-item.active .tab-label {
  color: #7b5cff;
  font-weight: 600;
}

/* ---- 首页图标：房子（屋顶+墙体+门） ---- */
.ic-home {
  position: relative;
  width: 40rpx;
  height: 40rpx;

  .home-roof {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 0;
    margin-left: -20rpx;
    border-left: 20rpx solid transparent;
    border-right: 20rpx solid transparent;
    border-bottom: 16rpx solid #ccc;
  }

  .home-body {
    position: absolute;
    bottom: 0;
    left: 6rpx;
    width: 28rpx;
    height: 24rpx;
    border: 4rpx solid #ccc;
    border-radius: 4rpx;
    box-sizing: border-box;
  }

  .home-door {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 10rpx;
    height: 12rpx;
    margin-left: -5rpx;
    border: 3rpx solid #ccc;
    border-bottom: none;
    border-radius: 5rpx 5rpx 0 0;
    box-sizing: border-box;
  }
}

.tab-item.active .ic-home {
  .home-roof {
    border-bottom-color: #7b5cff;
  }
  .home-body {
    border-color: #7b5cff;
  }
  .home-door {
    border-color: #7b5cff;
  }
}

/* ---- 内容管理图标：文档（边框矩形+文字线）+ 笔（旋转矩形+三角尖） ---- */
.ic-content {
  position: relative;
  width: 40rpx;
  height: 40rpx;

  .ct-doc {
    position: absolute;
    top: 4rpx;
    left: 4rpx;
    width: 24rpx;
    height: 28rpx;
    border: 3rpx solid #ccc;
    border-radius: 4rpx;
    box-sizing: border-box;
  }

  .ct-line {
    position: absolute;
    left: 9rpx;
    width: 14rpx;
    height: 2rpx;
    background: #ccc;
  }

  .ct-line-1 {
    top: 11rpx;
  }

  .ct-line-2 {
    top: 17rpx;
    width: 10rpx;
  }

  .ct-pencil {
    position: absolute;
    bottom: 2rpx;
    right: 3rpx;
    width: 4rpx;
    height: 16rpx;
    background: #ccc;
    transform: rotate(45deg);
    transform-origin: bottom center;
    border-radius: 2rpx;
  }

  .ct-tip {
    position: absolute;
    bottom: 0;
    right: 1rpx;
    width: 0;
    height: 0;
    border-left: 4rpx solid transparent;
    border-right: 4rpx solid transparent;
    border-top: 6rpx solid #ccc;
    transform: rotate(45deg);
    transform-origin: top center;
  }
}

.tab-item.active .ic-content {
  .ct-doc {
    border-color: #7b5cff;
  }

  .ct-line,
  .ct-pencil {
    background: #7b5cff;
  }

  .ct-tip {
    border-top-color: #7b5cff;
  }
}

/* ---- 我的图标：人形（头+身） ---- */
.ic-profile {
  position: relative;
  width: 40rpx;
  height: 40rpx;

  .pf-head {
    position: absolute;
    top: 2rpx;
    left: 50%;
    width: 16rpx;
    height: 16rpx;
    margin-left: -8rpx;
    border-radius: 50%;
    border: 4rpx solid #ccc;
    box-sizing: border-box;
  }

  .pf-body {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 28rpx;
    height: 16rpx;
    margin-left: -14rpx;
    border: 4rpx solid #ccc;
    border-bottom: none;
    border-radius: 14rpx 14rpx 0 0;
    box-sizing: border-box;
  }
}

.tab-item.active .ic-profile {
  .pf-head {
    border-color: #7b5cff;
  }
  .pf-body {
    border-color: #7b5cff;
  }
}
</style>
