<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="topbar">
      <view class="topbar-inner">
        <!-- Tab 切换 -->
        <view class="tab-switch">
          <text class="tab-item" :class="{ active: tab === 'recommend' }" @tap="switchTab('recommend')">推荐</text>
          <text class="tab-item" :class="{ active: tab === 'follow' }" @tap="switchTab('follow')">关注</text>
          <!-- 滑动指示器 -->
          <view class="tab-indicator" :class="{ right: tab === 'follow' }" />
        </view>
        <!-- 搜索按钮 -->
        <view class="search-btn" hover-class="search-hover" :hover-stay-time="80" @tap="onSearch">
          <view class="ic-search">
            <view class="search-circle" />
            <view class="search-handle" />
          </view>
        </view>
      </view>
    </view>

    <!-- Feed 列表 -->
    <view class="feed-list" :style="{ paddingTop: topbarHeight + 'px' }">
      <!-- 加载态 -->
      <view v-if="loading && feedList.length === 0" class="loading-state">
        <view class="loading-dots">
          <view class="dot dot1" />
          <view class="dot dot2" />
          <view class="dot dot3" />
        </view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空态 -->
      <view v-else-if="!loading && feedList.length === 0" class="empty-state">
        <view class="empty-icon">
          <view class="empty-circle" />
          <view class="empty-bar" />
        </view>
        <text class="empty-text">暂无内容</text>
      </view>

      <!-- Feed 卡片 -->
      <template v-else>
        <FeedCard
          v-for="item in feedList"
          :key="item.id"
          :item="item"
          @card-tap="onCardTap"
          @like="onLike"
          @comment="onComment"
          @share="onShare"
          @follow="onFollow"
          @vote="onVote"
        />
        <!-- 加载更多 -->
        <view v-if="loading" class="load-more">
          <view class="loading-dots small">
            <view class="dot dot1" />
            <view class="dot dot2" />
            <view class="dot dot3" />
          </view>
          <text class="load-more-text">加载更多...</text>
        </view>
        <view v-else-if="!hasMore" class="load-more">
          <text class="load-more-text">没有更多了</text>
        </view>
      </template>
    </view>

    <!-- 底部 TabBar -->
    <CustomTabBar current="/pages/index/index" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import { fetchFeed, toggleLike, castVote } from '@/api/feed'
import type { FeedItem } from '@/api/feed'
import FeedCard from '@/components/FeedCard.vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

const tab = ref<'recommend' | 'follow'>('recommend')
const feedList = ref<FeedItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = reactive({ page: 1, pageSize: 5 })
const topbarHeight = 88 // 顶部栏高度（px，状态栏+导航栏）

/* ---- 加载数据 ---- */
async function loadFeed(reset = false) {
  if (loading.value) return
  loading.value = true
  if (reset) {
    page.page = 1
    hasMore.value = true
  }
  const result = await fetchFeed({
    page: page.page,
    pageSize: page.pageSize,
    tab: tab.value,
  })
  if (reset) {
    feedList.value = result.list
  } else {
    feedList.value.push(...result.list)
  }
  hasMore.value = result.hasMore
  page.page++
  loading.value = false
}

/* ---- Tab 切换 ---- */
function switchTab(t: 'recommend' | 'follow') {
  if (tab.value === t) return
  tab.value = t
  loadFeed(true)
}

/* ---- 下拉刷新 ---- */
onPullDownRefresh(async () => {
  await loadFeed(true)
  uni.stopPullDownRefresh()
})

/* ---- 上拉加载 ---- */
onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    loadFeed(false)
  }
})

/* ---- 互动事件 ---- */
function onLike(item: FeedItem) {
  item.liked = !item.liked
  toggleLike(item.id, item.liked)
}

function onComment(item: FeedItem) {
  uni.navigateTo({ url: '/pages/comment/comment?id=' + item.id })
}

function onShare(item: FeedItem) {
  uni.showToast({ title: '转发功能开发中', icon: 'none' })
}

function onFollow(id: number) {
  uni.showToast({ title: '关注成功', icon: 'none' })
}

function onVote(pollId: number, optionId: number) {
  castVote(pollId, optionId)
}

function onCardTap(item: FeedItem) {
  uni.navigateTo({ url: '/pages/detail/detail?id=' + item.id })
}

function onSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}

onMounted(() => {
  loadFeed(true)
})
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

/* ---- 顶部导航栏 ---- */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}
.topbar-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--status-bar-height) + 16rpx) 32rpx 16rpx;
}

/* ---- Tab 切换 ---- */
.tab-switch {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.tab-item {
  font-size: 32rpx;
  color: #999;
  font-weight: 500;
  margin-right: 48rpx;
  transition: all 0.25s ease;

  &.active {
    color: #1a1a1a;
    font-weight: 700;
    font-size: 36rpx;
  }
}
.tab-indicator {
  position: absolute;
  bottom: -8rpx;
  left: 0;
  width: 48rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background: linear-gradient(90deg, #7b5cff, #ff5c9d);
  transition: transform 0.3s ease;

  &.right {
    transform: translateX(112rpx);
  }
}

/* ---- 搜索按钮 ---- */
.search-btn {
  padding: 10rpx;
}
.search-hover {
  opacity: 0.6;
}
.ic-search {
  position: relative;
  width: 36rpx;
  height: 36rpx;

  .search-circle {
    width: 24rpx;
    height: 24rpx;
    border: 4rpx solid #666;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .search-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12rpx;
    height: 4rpx;
    background: #666;
    border-radius: 2rpx;
    transform: rotate(45deg);
  }
}

/* ---- Feed 列表 ---- */
.feed-list {
  padding: 20rpx 24rpx;
}

/* ---- 加载态 ---- */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}
.loading-dots {
  display: flex;
  flex-direction: row;
  align-items: center;

  &.small .dot {
    width: 10rpx;
    height: 10rpx;
  }
}
.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #7b5cff;
  margin: 0 8rpx;
  animation: dot-bounce 1.2s ease-in-out infinite;
}
.dot1 { animation-delay: 0s; }
.dot2 { animation-delay: 0.2s; }
.dot3 { animation-delay: 0.4s; }
@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
.loading-text {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}

/* ---- 空态 ---- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
}
.empty-icon {
  position: relative;
  width: 120rpx;
  height: 120rpx;

  .empty-circle {
    width: 80rpx;
    height: 80rpx;
    border: 6rpx solid rgba(123, 92, 255, 0.2);
    border-radius: 50%;
    margin: 0 auto;
  }

  .empty-bar {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 40rpx;
    height: 6rpx;
    margin-left: -20rpx;
    border-radius: 3rpx;
    background: rgba(123, 92, 255, 0.2);
  }
}
.empty-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #999;
}

/* ---- 加载更多 ---- */
.load-more {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}
.load-more-text {
  font-size: 24rpx;
  color: #999;
  margin-left: 16rpx;
}
</style>
