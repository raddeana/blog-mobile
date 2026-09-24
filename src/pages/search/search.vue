<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="topbar">
      <view class="topbar-inner">
        <!-- 返回按钮 -->
        <view class="back-btn" hover-class="back-hover" :hover-stay-time="80" @tap="onBack">
          <view class="back-arrow" />
        </view>
        <!-- 搜索输入框 -->
        <view class="search-input-wrap">
          <view class="ic-search">
            <view class="search-circle" />
            <view class="search-handle" />
          </view>
          <input
            v-model="keyword"
            class="search-input"
            type="text"
            placeholder="搜索文章、话题、用户"
            placeholder-style="color: #bbb"
            confirm-type="search"
            @confirm="doSearch"
            :focus="autoFocus"
          />
        </view>
        <!-- 搜索按钮 -->
        <view class="search-btn" hover-class="search-hover" :hover-stay-time="80" @tap="doSearch">
          <text class="search-btn-text">搜索</text>
        </view>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="content" :style="{ paddingTop: topbarHeight + 'px' }">
      <!-- 搜索前：历史 + 热搜 -->
      <template v-if="!hasSearched">
        <!-- 搜索历史 -->
        <view v-if="history.length > 0" class="section">
          <view class="section-header">
            <text class="section-title">搜索历史</text>
            <view class="clear-btn" hover-class="clear-hover" :hover-stay-time="80" @tap="onClearHistory">
              <text class="clear-text">清空</text>
            </view>
          </view>
          <view class="tag-list">
            <view
              v-for="item in history"
              :key="item"
              class="history-tag"
              hover-class="tag-hover"
              :hover-stay-time="80"
              @tap="onTapTag(item)"
            >
              <text class="history-tag-text">{{ item }}</text>
            </view>
          </view>
        </view>

        <!-- 热门搜索 -->
        <view class="section">
          <text class="section-title">热门搜索</text>
          <view class="hot-list">
            <view
              v-for="(item, idx) in hotKeywords"
              :key="item"
              class="hot-item"
              hover-class="hot-hover"
              :hover-stay-time="80"
              @tap="onTapTag(item)"
            >
              <text class="hot-num" :class="{ top: idx < 3 }">{{ idx + 1 }}</text>
              <text class="hot-text">{{ item }}</text>
            </view>
          </view>
        </view>
      </template>

      <!-- 搜索后：结果列表 -->
      <template v-else>
        <!-- 加载态 -->
        <view v-if="loading && resultList.length === 0" class="loading-state">
          <view class="loading-dots">
            <view class="dot dot1" />
            <view class="dot dot2" />
            <view class="dot dot3" />
          </view>
          <text class="loading-text">搜索中...</text>
        </view>

        <!-- 空结果 -->
        <view v-else-if="!loading && resultList.length === 0" class="empty-state">
          <view class="empty-icon">
            <view class="empty-circle" />
            <view class="empty-bar" />
          </view>
          <text class="empty-text">未找到 "{{ searchedKeyword }}" 相关内容</text>
        </view>

        <!-- 结果列表 -->
        <template v-else>
          <view class="result-count">
            <text class="result-count-text">找到 {{ totalFound }} 条结果</text>
          </view>
          <FeedCard
            v-for="item in resultList"
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
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onReachBottom } from '@dcloudio/uni-app'
import { searchFeed, getHotKeywords, getSearchHistory, addSearchHistory, clearSearchHistory } from '@/api/search'
import type { FeedItem } from '@/api/feed'
import FeedCard from '@/components/FeedCard.vue'

const keyword = ref('')
const searchedKeyword = ref('')
const hasSearched = ref(false)
const autoFocus = ref(true)
const resultList = ref<FeedItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const totalFound = ref(0)
const page = reactive({ page: 1, pageSize: 5 })
const history = ref<string[]>([])
const hotKeywords = ref<string[]>([])
const topbarHeight = 88

/* ---- 初始化 ---- */
async function init() {
  history.value = getSearchHistory()
  hotKeywords.value = await getHotKeywords()
}
init()

/* ---- 执行搜索 ---- */
async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) {
    uni.showToast({ title: '请输入搜索内容', icon: 'none' })
    return
  }
  hasSearched.value = true
  searchedKeyword.value = kw
  page.page = 1
  hasMore.value = true
  addSearchHistory(kw)
  history.value = getSearchHistory()

  loading.value = true
  const result = await searchFeed({ keyword: kw, page: page.page, pageSize: page.pageSize })
  resultList.value = result.list
  totalFound.value = result.list.length
  hasMore.value = result.hasMore
  page.page++
  loading.value = false
}

/* ---- 上拉加载更多 ---- */
onReachBottom(() => {
  if (!hasSearched.value || !hasMore.value || loading.value) return
  loadMore()
})

async function loadMore() {
  loading.value = true
  const result = await searchFeed({ keyword: searchedKeyword.value, page: page.page, pageSize: page.pageSize })
  resultList.value.push(...result.list)
  hasMore.value = result.hasMore
  page.page++
  loading.value = false
}

/* ---- 点击标签搜索 ---- */
function onTapTag(text: string) {
  keyword.value = text
  doSearch()
}

/* ---- 清空历史 ---- */
function onClearHistory() {
  uni.showModal({
    title: '清空搜索历史',
    content: '确定清空所有搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        clearSearchHistory()
        history.value = []
      }
    },
  })
}

/* ---- 返回 ---- */
function onBack() {
  uni.navigateBack({ delta: 1 })
}

/* ---- 互动事件 ---- */
function onLike(item: FeedItem) {
  item.liked = !item.liked
}

function onComment(item: FeedItem) {
  uni.navigateTo({ url: '/pages/comment/comment?id=' + item.id })
}

function onCardTap(item: FeedItem) {
  uni.navigateTo({ url: '/pages/detail/detail?id=' + item.id })
}

function onShare(item: FeedItem) {
  uni.showToast({ title: '转发功能开发中', icon: 'none' })
}

function onFollow(id: number) {
  uni.showToast({ title: '关注成功', icon: 'none' })
}

function onVote(pollId: number, optionId: number) {
  // 预留投票接口
}
</script>

<style lang="scss">
page {
  background: #f5f5f7;
}

.page {
  min-height: 100vh;
  background: #f5f5f7;
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
  padding: calc(var(--status-bar-height) + 16rpx) 24rpx 16rpx;
}

/* ---- 返回按钮 ---- */
.back-btn {
  padding: 10rpx 12rpx;
}
.back-hover {
  opacity: 0.6;
}
.back-arrow {
  width: 20rpx;
  height: 20rpx;
  border-left: 4rpx solid #333;
  border-bottom: 4rpx solid #333;
  transform: rotate(45deg);
}

/* ---- 搜索输入框 ---- */
.search-input-wrap {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  margin: 0 16rpx;
  padding: 0 20rpx;
  background: #f0f0f2;
  border-radius: 32rpx;
}
.ic-search {
  position: relative;
  width: 28rpx;
  height: 28rpx;
  margin-right: 12rpx;
  flex-shrink: 0;

  .search-circle {
    width: 18rpx;
    height: 18rpx;
    border: 3rpx solid #999;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .search-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10rpx;
    height: 3rpx;
    background: #999;
    border-radius: 2rpx;
    transform: rotate(45deg);
  }
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

/* ---- 搜索按钮 ---- */
.search-btn {
  padding: 10rpx 8rpx;
}
.search-hover {
  opacity: 0.6;
}
.search-btn-text {
  font-size: 28rpx;
  color: #7b5cff;
  font-weight: 600;
}

/* ---- 内容区 ---- */
.content {
  padding: 20rpx 24rpx;
}

/* ---- 通用区块 ---- */
.section {
  margin-bottom: 40rpx;
}
.section-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1a1a1a;
}

/* ---- 清空按钮 ---- */
.clear-btn {
  padding: 6rpx 12rpx;
}
.clear-hover {
  opacity: 0.6;
}
.clear-text {
  font-size: 24rpx;
  color: #999;
}

/* ---- 历史标签 ---- */
.tag-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.history-tag {
  padding: 12rpx 24rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  border-radius: 30rpx;
  background: rgba(123, 92, 255, 0.06);
  border: 1rpx solid rgba(123, 92, 255, 0.3);
}
.tag-hover {
  background: rgba(123, 92, 255, 0.12);
}
.history-tag-text {
  font-size: 24rpx;
  color: #7b5cff;
}

/* ---- 热门搜索列表 ---- */
.hot-list {
  display: flex;
  flex-direction: column;
}
.hot-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80rpx;
}
.hot-hover {
  background: rgba(0, 0, 0, 0.02);
}
.hot-num {
  width: 40rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #bbb;

  &.top {
    color: #ff5c9d;
  }
}
.hot-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

/* ---- 结果计数 ---- */
.result-count {
  padding: 8rpx 0 20rpx;
}
.result-count-text {
  font-size: 24rpx;
  color: #999;
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
