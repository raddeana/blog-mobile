<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="topbar">
      <view class="topbar-inner">
        <text class="topbar-title">内容管理</text>
        <!-- 新建按钮 -->
        <view class="new-btn" hover-class="new-hover" :hover-stay-time="80" @tap="onNew">
          <view class="ic-plus">
            <view class="plus-h" />
            <view class="plus-v" />
          </view>
        </view>
      </view>
    </view>

    <!-- 内容列表 -->
    <view class="content" :style="{ paddingTop: topbarHeight + 'px' }">
      <!-- 加载态 -->
      <view v-if="loading && list.length === 0" class="loading-state">
        <view class="loading-dots">
          <view class="dot dot1" />
          <view class="dot dot2" />
          <view class="dot dot3" />
        </view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空态 -->
      <view v-else-if="!loading && list.length === 0" class="empty-state">
        <view class="empty-icon">
          <view class="empty-circle" />
          <view class="empty-bar" />
        </view>
        <text class="empty-text">还没有发布过内容</text>
        <view class="empty-cta" hover-class="cta-hover" :hover-stay-time="80" @tap="onNew">
          立即发布
        </view>
      </view>

      <!-- 列表 -->
      <view v-else class="content-list">
        <view
          v-for="item in list"
          :key="item.id"
          class="content-card"
        >
          <!-- 类型徽章 -->
          <view class="card-type-badge" :class="item.type">
            <text class="badge-text">{{ typeLabel(item.type) }}</text>
          </view>

          <!-- 卡片主体 -->
          <view class="card-main">
            <text v-if="item.type === 'article'" class="card-title">{{ item.title }}</text>
            <text class="card-excerpt">{{ excerpt(item) }}</text>

            <!-- 媒体计数 -->
            <view v-if="item.type !== 'poll' && item.medias.length > 0" class="card-media-count">
              <view class="media-dot" />
              <text class="media-count-text">{{ item.medias.length }} 个附件</text>
            </view>
            <view v-else-if="item.type === 'poll'" class="card-media-count">
              <view class="media-dot" />
              <text class="media-count-text">{{ item.pollOptions.length }} 个选项</text>
            </view>

            <!-- 元信息 + 操作 -->
            <view class="card-meta">
              <text class="meta-time">{{ formatTime(item.updatedAt) }}</text>
              <view class="meta-status" :class="item.status">
                <text class="status-text">{{ item.status === 'draft' ? '草稿' : '已发布' }}</text>
              </view>
              <view class="meta-actions">
                <view class="edit-btn" hover-class="action-hover" :hover-stay-time="80" @tap.stop="onEdit(item)">
                  <text class="action-text edit-text">编辑</text>
                </view>
                <view class="delete-btn" hover-class="action-hover" :hover-stay-time="80" @tap.stop="onDelete(item)">
                  <text class="action-text delete-text">删除</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部 TabBar -->
    <CustomTabBar current="/pages/content/content" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { fetchMyContent, deleteContent, consumeMyContentDirty } from '@/api/content'
import type { ContentItem } from '@/api/content'
import { formatTime } from '@/utils/detail-logic'
import { summarize, contentTypeLabel } from '@/utils/content-logic'
import CustomTabBar from '@/components/CustomTabBar.vue'

const list = ref<ContentItem[]>([])
const loading = ref(false)
const topbarHeight = 88

async function loadList() {
  loading.value = true
  list.value = await fetchMyContent()
  loading.value = false
}

onMounted(loadList)

// 从 editor 返回 / 从其它 tab 切回时检测 dirty 刷新
onShow(() => {
  if (consumeMyContentDirty()) loadList()
})

onPullDownRefresh(async () => {
  await loadList()
  uni.stopPullDownRefresh()
})

function typeLabel(type: ContentItem['type']) {
  return contentTypeLabel(type)
}

function excerpt(item: ContentItem): string {
  if (item.type === 'article') return summarize(item.body, 50)
  if (item.type === 'message') return summarize(item.body, 50)
  return summarize(item.body, 50)
}

function onEdit(item: ContentItem) {
  uni.navigateTo({ url: `/pages/content/editor?id=${item.id}&type=${item.type}` })
}

function onNew() {
  uni.navigateTo({ url: '/pages/content/editor?type=article' })
}

async function onDelete(item: ContentItem) {
  const res = await uni.showModal({
    title: '删除内容',
    content: `确认删除这条${contentTypeLabel(item.type)}？此操作不可撤销。`,
    confirmText: '删除',
    confirmColor: '#ff5c9d',
    cancelText: '取消',
  })
  if (res.confirm) {
    await deleteContent(item.id)
    uni.showToast({ title: '已删除', icon: 'success' })
    loadList()
  }
}
</script>

<style lang="scss">
page {
  background: #f5f5f7;
}
</style>

<style lang="scss" scoped>
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
  padding: calc(var(--status-bar-height) + 16rpx) 24rpx 16rpx;
}
.topbar-title {
  flex: 1;
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}

/* ---- 新建按钮 ---- */
.new-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: $button-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(123, 92, 255, 0.3);
}
.new-hover {
  opacity: 0.85;
  transform: scale(0.95);
}
.ic-plus {
  position: relative;
  width: 32rpx;
  height: 32rpx;

  .plus-h {
    position: absolute;
    top: 50%;
    left: 0;
    width: 32rpx;
    height: 4rpx;
    margin-top: -2rpx;
    background: #ffffff;
    border-radius: 2rpx;
  }

  .plus-v {
    position: absolute;
    left: 50%;
    top: 0;
    width: 4rpx;
    height: 32rpx;
    margin-left: -2rpx;
    background: #ffffff;
    border-radius: 2rpx;
  }
}

/* ---- 内容区 ---- */
.content {
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
  padding: 120rpx 0;
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
.empty-cta {
  margin-top: 32rpx;
  padding: 16rpx 48rpx;
  font-size: 26rpx;
  color: #ffffff;
  background: $button-gradient;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(123, 92, 255, 0.3);
}
.cta-hover {
  opacity: 0.85;
  transform: scale(0.96);
}

/* ---- 内容列表 ---- */
.content-list {
  display: flex;
  flex-direction: column;
}
.content-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

/* ---- 类型徽章 ---- */
.card-type-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 36rpx;
  border-radius: 18rpx;
  flex-shrink: 0;
  margin-right: 20rpx;

  &.article {
    background: linear-gradient(135deg, #7b5cff, #b750ff);
  }

  &.message {
    background: linear-gradient(135deg, #38bdf8, #7b5cff);
  }

  &.poll {
    background: linear-gradient(135deg, #ff5c9d, #fbbf24);
  }
}
.badge-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 600;
}

/* ---- 卡片主体 ---- */
.card-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-excerpt {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* ---- 媒体计数 ---- */
.card-media-count {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10rpx;
}
.media-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #b28bff;
  margin-right: 8rpx;
}
.media-count-text {
  font-size: 22rpx;
  color: #999;
}

/* ---- 元信息 + 操作 ---- */
.card-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16rpx;
}
.meta-time {
  font-size: 22rpx;
  color: #999;
}
.meta-status {
  margin-left: 16rpx;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
  background: rgba(123, 92, 255, 0.1);

  &.draft {
    background: rgba(0, 0, 0, 0.05);
  }
}
.status-text {
  font-size: 20rpx;
  color: #7b5cff;
}
.meta-status.draft .status-text {
  color: #999;
}
.meta-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
}
.edit-btn,
.delete-btn {
  padding: 6rpx 20rpx;
}
.action-hover {
  opacity: 0.6;
}
.action-text {
  font-size: 24rpx;
}
.edit-text {
  color: #7b5cff;
}
.delete-text {
  color: #ff5c9d;
}
</style>
