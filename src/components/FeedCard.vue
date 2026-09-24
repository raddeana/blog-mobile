<template>
  <view class="feed-card">
    <!-- 用户信息 -->
    <view class="card-header">
      <view class="avatar-wrap">
        <view class="avatar-default">
          <view class="avatar-head" />
          <view class="avatar-body" />
        </view>
      </view>
      <view class="user-info">
        <text class="username">{{ item.authorName }}</text>
        <text class="time">{{ timeText }}</text>
      </view>
      <!-- 关注按钮 -->
      <view class="follow-btn" hover-class="follow-hover" :hover-stay-time="80" @tap="$emit('follow', item.id)">
        <text class="follow-text">+ 关注</text>
      </view>
    </view>

    <!-- 内容区：文章 -->
    <template v-if="item.type === 'article'">
      <view class="article-content" @tap="$emit('card-tap', item)">
        <text class="article-title">{{ item.title }}</text>
        <text class="article-excerpt">{{ item.excerpt }}</text>
        <!-- 封面占位 -->
        <view class="article-cover" :style="{ background: item.coverGradient }">
          <view class="cover-icon" />
        </view>
        <!-- 标签 -->
        <view class="tag-row">
          <text v-for="tag in item.tags" :key="tag" class="tag">#{{ tag }}</text>
        </view>
      </view>
    </template>

    <!-- 内容区：投票 -->
    <template v-if="item.type === 'poll'">
      <view class="poll-content">
        <view class="poll-badge">
          <text class="poll-badge-text">{{ item.expired ? '已结束' : '投票' }}</text>
        </view>
        <text class="poll-question">{{ item.question }}</text>
        <!-- 选项列表 -->
        <view class="poll-options">
          <view
            v-for="opt in item.options"
            :key="opt.id"
            class="poll-option"
            :class="{ voted: selectedOption === opt.id }"
            hover-class="poll-option-hover"
            :hover-stay-time="80"
            @tap="onVote(opt.id)"
          >
            <view class="poll-bar" :style="{ width: barWidth(opt.votes) + '%' }" />
            <text class="option-text">{{ opt.text }}</text>
            <text class="option-percent">{{ barWidth(opt.votes) }}%</text>
          </view>
        </view>
        <text class="poll-total">{{ item.totalVotes }} 人参与</text>
      </view>
    </template>

    <!-- 内容区：短信息 -->
    <template v-if="item.type === 'message'">
      <view class="message-content" @tap="$emit('card-tap', item)">
        <text class="message-text">{{ item.content }}</text>
      </view>
    </template>

    <!-- 互动栏 -->
    <view class="action-bar">
      <view class="action-item" hover-class="action-hover" :hover-stay-time="80" @tap="onLike">
        <view class="ic-heart" :class="{ liked: item.liked }">
          <view class="heart-l" />
          <view class="heart-r" />
          <view class="heart-b" />
        </view>
        <text class="action-text" :class="{ liked: item.liked }">{{ displayLikes }}</text>
      </view>

      <view class="action-item" hover-class="action-hover" :hover-stay-time="80" @tap="$emit('comment', item)">
        <view class="ic-comment">
          <view class="comment-body" />
          <view class="comment-tail" />
        </view>
        <text class="action-text">{{ item.comments }}</text>
      </view>

      <view class="action-item" hover-class="action-hover" :hover-stay-time="80" @tap="$emit('share', item)">
        <view class="ic-share">
          <view class="share-shaft" />
          <view class="share-head" />
        </view>
        <text class="action-text">{{ item.shares }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FeedItem } from '@/api/feed'

const props = defineProps<{ item: FeedItem }>()

defineEmits<{
  (e: 'card-tap', item: FeedItem): void
  (e: 'like', item: FeedItem): void
  (e: 'comment', item: FeedItem): void
  (e: 'share', item: FeedItem): void
  (e: 'follow', id: number): void
  (e: 'vote', pollId: number, optionId: number): void
}>()

const selectedOption = ref(0)

/* ---- 显示数据 ---- */
const displayLikes = computed(() => props.item.likes + (props.item.liked ? 1 : 0))

const timeText = computed(() => {
  const d = new Date(props.item.createdAt)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = diff / 3600000
  if (hours < 1) return Math.floor(diff / 60000) + '分钟前'
  if (hours < 24) return Math.floor(hours) + '小时前'
  return `${d.getMonth() + 1}月${d.getDate()}日`
})

/* ---- 投票进度条 ---- */
function barWidth(votes: number): number {
  if (props.item.type !== 'poll') return 0
  const total = (props.item as any).totalVotes || 1
  return Math.round((votes / total) * 100)
}

function onVote(optionId: number) {
  if (props.item.type !== 'poll') return
  if (props.item.expired) return
  if (selectedOption.value) return
  selectedOption.value = optionId
  // emit vote event
}
</script>

<style lang="scss">
.feed-card {
  background: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

/* ---- 用户信息 ---- */
.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24rpx;
}
.avatar-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  padding: 3rpx;
  background: linear-gradient(135deg, #7b5cff, #ff5c9d);
  flex-shrink: 0;
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
  width: 26rpx;
  height: 26rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
}
.avatar-body {
  width: 58rpx;
  height: 25rpx;
  margin-top: 4rpx;
  border-radius: 29rpx 29rpx 0 0;
  background: rgba(255, 255, 255, 0.96);
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 20rpx;
}
.username {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}
.time {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}
.follow-btn {
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  background: linear-gradient(135deg, rgba(123, 92, 255, 0.1), rgba(255, 92, 157, 0.08));
  border: 1rpx solid rgba(123, 92, 255, 0.3);
}
.follow-hover {
  transform: scale(0.95);
  opacity: 0.85;
}
.follow-text {
  font-size: 22rpx;
  color: #7b5cff;
  font-weight: 600;
}

/* ---- 文章 ---- */
.article-content {
  display: flex;
  flex-direction: column;
}
.article-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 12rpx;
}
.article-excerpt {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.article-cover {
  width: 100%;
  height: 320rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}
.cover-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  border: 4rpx solid rgba(255, 255, 255, 0.4);
}
.tag-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.tag {
  font-size: 22rpx;
  color: #7b5cff;
  margin-right: 20rpx;
  margin-bottom: 4rpx;
}

/* ---- 投票 ---- */
.poll-content {
  display: flex;
  flex-direction: column;
}
.poll-badge {
  display: inline-flex;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  background: linear-gradient(135deg, #7b5cff, #ff5c9d);
  align-self: flex-start;
  margin-bottom: 16rpx;
}
.poll-badge-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: 600;
}
.poll-question {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 20rpx;
}
.poll-options {
  display: flex;
  flex-direction: column;
}
.poll-option {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 72rpx;
  margin-bottom: 12rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: rgba(123, 92, 255, 0.06);
  border: 1rpx solid rgba(123, 92, 255, 0.12);
}
.poll-option-hover {
  background: rgba(123, 92, 255, 0.12);
}
.poll-option.voted {
  border-color: rgba(123, 92, 255, 0.5);
}
.poll-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(123, 92, 255, 0.15), rgba(255, 92, 157, 0.1));
  border-radius: 12rpx;
  transition: width 0.4s ease;
}
.option-text {
  position: relative;
  z-index: 1;
  flex: 1;
  font-size: 26rpx;
  color: #333;
  padding-left: 24rpx;
}
.option-percent {
  position: relative;
  z-index: 1;
  font-size: 24rpx;
  color: #7b5cff;
  font-weight: 600;
  padding-right: 24rpx;
}
.poll-total {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}

/* ---- 短信息 ---- */
.message-content {
  display: flex;
  flex-direction: column;
}
.message-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.7;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

/* ---- 互动栏 ---- */
.action-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 28rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.04);
}
.action-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10rpx 20rpx;
}
.action-hover {
  opacity: 0.6;
}
.action-text {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}
.action-text.liked {
  color: #ff5c9d;
  font-weight: 600;
}

/* ---- 心形图标（两圆 + 旋转方块，纯填充） ---- */
.ic-heart {
  position: relative;
  width: 36rpx;
  height: 32rpx;

  .heart-l,
  .heart-r {
    position: absolute;
    top: 0;
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background: #bbb;
  }

  .heart-l {
    left: 0;
  }

  .heart-r {
    right: 0;
  }

  /* top:7 → 方块中心 y=17，底部尖角 y≈31.14 不溢出 32rpx 容器 */
  .heart-b {
    position: absolute;
    top: 7rpx;
    left: 50%;
    width: 20rpx;
    height: 20rpx;
    margin-left: -10rpx;
    background: #bbb;
    transform: rotate(45deg);
  }

  &.liked {
    .heart-l,
    .heart-r,
    .heart-b {
      background: #ff5c9d;
    }
  }
}

/* ---- 评论图标（圆角气泡 + 下尖尾） ---- */
.ic-comment {
  position: relative;
  width: 36rpx;
  height: 32rpx;

  .comment-body {
    width: 36rpx;
    height: 22rpx;
    border: 3rpx solid #bbb;
    border-radius: 10rpx 10rpx 10rpx 4rpx;
    box-sizing: border-box;
    background: transparent;
  }

  /* top:19 对齐 body 底部边框（y=19~22），tail 向下延伸至 y=27 */
  .comment-tail {
    position: absolute;
    top: 19rpx;
    left: 8rpx;
    width: 0;
    height: 0;
    border-left: 5rpx solid transparent;
    border-right: 5rpx solid transparent;
    border-top: 8rpx solid #bbb;
  }
}

/* ---- 转发图标（水平线 + 右箭头头） ---- */
.ic-share {
  position: relative;
  width: 36rpx;
  height: 32rpx;

  /* top:15 → 线中心 y=16.5 ≈ 容器中心 y=16 */
  .share-shaft {
    position: absolute;
    top: 15rpx;
    left: 0;
    width: 22rpx;
    height: 3rpx;
    background: #bbb;
    border-radius: 2rpx;
  }

  /* 12rpx 方块旋转后右尖 y≈35.5 不溢出；中心 y=16 与 shaft 对齐 */
  .share-head {
    position: absolute;
    top: 10rpx;
    right: 3rpx;
    width: 12rpx;
    height: 12rpx;
    border-top: 3rpx solid #bbb;
    border-right: 3rpx solid #bbb;
    transform: rotate(45deg);
    box-sizing: border-box;
  }
}
</style>
