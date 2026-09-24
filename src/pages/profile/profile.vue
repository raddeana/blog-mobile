<template>
  <view class="page">
    <!-- 顶部渐变区域 -->
    <view class="hero">
      <view class="hero-inner">
        <!-- 默认头像 -->
        <view class="logo-wrap">
          <view class="avatar-default">
            <view class="avatar-head" />
            <view class="avatar-body" />
          </view>
        </view>
        <text class="username">博客单用户</text>
        <text class="bio">这个人很懒，什么都没留下</text>

        <!-- 数据统计 -->
        <view class="stats">
          <view class="stat-item">
            <text class="stat-num">0</text>
            <text class="stat-label">关注</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">0</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">0</text>
            <text class="stat-label">获赞</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-card">
      <view class="menu-item" hover-class="menu-hover" :hover-stay-time="80" @tap="onMenu('我的文章')">
        <view class="menu-icon ic-article">
          <view class="art-doc" />
          <view class="art-line art-line-1" />
          <view class="art-line art-line-2" />
        </view>
        <text class="menu-text">我的文章</text>
        <view class="menu-arrow" />
      </view>
      <view class="menu-item" hover-class="menu-hover" :hover-stay-time="80" @tap="onMenu('我的投票')">
        <view class="menu-icon ic-chart">
          <view class="chart-bar chart-bar-1" />
          <view class="chart-bar chart-bar-2" />
          <view class="chart-bar chart-bar-3" />
        </view>
        <text class="menu-text">我的投票</text>
        <view class="menu-arrow" />
      </view>
      <view class="menu-item" hover-class="menu-hover" :hover-stay-time="80" @tap="onMenu('收藏夹')">
        <view class="menu-icon ic-star">
          <view class="star-shape" />
        </view>
        <text class="menu-text">收藏夹</text>
        <view class="menu-arrow" />
      </view>
      <view class="menu-item" hover-class="menu-hover" :hover-stay-time="80" @tap="onMenu('设置')">
        <view class="menu-icon ic-gear">
          <view class="gear-circle" />
          <view class="gear-dot" />
        </view>
        <text class="menu-text">设置</text>
        <view class="menu-arrow" />
      </view>
    </view>

    <!-- 底部 TabBar -->
    <CustomTabBar current="/pages/profile/profile" />
  </view>
</template>

<script setup lang="ts">
import CustomTabBar from '@/components/CustomTabBar.vue'

function onMenu(title: string) {
  uni.showToast({ title: title + '开发中', icon: 'none' })
}
</script>

<style lang="scss">
page {
  background: #f5f5f7;
}

.page {
  min-height: 100vh;
  background: #f5f5f7;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

/* ---- 顶部渐变区域 ---- */
.hero {
  background: linear-gradient(160deg, #2b1a5e 0%, #1a103a 45%, #241040 100%);
  padding-top: var(--status-bar-height);
}
.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 60rpx;
}
.logo-wrap {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  padding: 5rpx;
  background: linear-gradient(135deg, #7b5cff, #ff5c9d);
  box-shadow: 0 12rpx 40rpx rgba(123, 92, 255, 0.4);
}
.avatar-default {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(160deg, #8f6bff 0%, #b750ff 55%, #ff5c9d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}
.avatar-head {
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
}
.avatar-body {
  width: 96rpx;
  height: 42rpx;
  margin-top: 6rpx;
  border-radius: 48rpx 48rpx 0 0;
  background: rgba(255, 255, 255, 0.96);
}
.username {
  margin-top: 24rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2rpx;
}
.bio {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* ---- 数据统计 ---- */
.stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 32rpx;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32rpx;
}
.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}
.stat-label {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}
.stat-divider {
  width: 1rpx;
  height: 40rpx;
  background: rgba(255, 255, 255, 0.15);
}

/* ---- 功能列表 ---- */
.menu-card {
  margin: 24rpx;
  padding: 0 28rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}
.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);

  &:last-child {
    border-bottom: none;
  }
}
.menu-hover {
  background: rgba(0, 0, 0, 0.02);
}
.menu-icon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}
.menu-arrow {
  width: 16rpx;
  height: 16rpx;
  border-top: 3rpx solid #ccc;
  border-right: 3rpx solid #ccc;
  transform: rotate(45deg);
}

/* ---- 文章图标 ---- */
.ic-article {
  position: relative;
  .art-doc {
    width: 28rpx;
    height: 36rpx;
    border: 3rpx solid #7b5cff;
    border-radius: 4rpx;
    box-sizing: border-box;
  }
  .art-line {
    position: absolute;
    left: 50%;
    width: 16rpx;
    height: 2rpx;
    margin-left: -8rpx;
    background: #7b5cff;
  }
  .art-line-1 { top: 12rpx; }
  .art-line-2 { top: 20rpx; width: 12rpx; margin-left: -6rpx; }
}

/* ---- 图表图标 ---- */
.ic-chart {
  align-items: flex-end;
  .chart-bar {
    width: 8rpx;
    border-radius: 2rpx;
    background: #ff5c9d;
  }
  .chart-bar-1 { height: 16rpx; margin-right: 6rpx; }
  .chart-bar-2 { height: 24rpx; margin-right: 6rpx; }
  .chart-bar-3 { height: 32rpx; }
}

/* ---- 星标图标 ---- */
.ic-star {
  .star-shape {
    width: 28rpx;
    height: 28rpx;
    background: #fbbf24;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
}

/* ---- 齿轮图标 ---- */
.ic-gear {
  .gear-circle {
    width: 28rpx;
    height: 28rpx;
    border: 4rpx solid #7b5cff;
    border-radius: 50%;
    box-sizing: border-box;
  }
  .gear-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8rpx;
    height: 8rpx;
    margin: -4rpx 0 0 -4rpx;
    border-radius: 50%;
    background: #7b5cff;
  }
}
</style>
