<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="topbar">
      <view class="topbar-inner">
        <!-- 返回按钮 -->
        <view class="back-btn" hover-class="back-hover" :hover-stay-time="80" @tap="onBack">
          <view class="back-arrow" />
        </view>
        <!-- 标题 -->
        <text class="topbar-title">评论</text>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="content" :style="{ paddingTop: topbarHeight + 'px' }">
      <!-- 原帖加载态 -->
      <view v-if="!feedItem" class="loading-state">
        <view class="loading-dots">
          <view class="dot dot1" />
          <view class="dot dot2" />
          <view class="dot dot3" />
        </view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 原帖 -->
      <FeedCard
        v-else
        :item="feedItem"
        @like="onPostLike"
        @comment="onPostComment"
        @share="onPostShare"
        @follow="onPostFollow"
        @vote="onPostVote"
      />

      <!-- 评论数标题 -->
      <view v-if="feedItem && !loading && commentList.length > 0" class="comment-count">
        <text class="comment-count-text">共 {{ total }} 条评论</text>
      </view>

      <!-- 评论加载态 -->
      <view v-if="loading && commentList.length === 0" class="loading-state">
        <view class="loading-dots">
          <view class="dot dot1" />
          <view class="dot dot2" />
          <view class="dot dot3" />
        </view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空态 -->
      <view v-else-if="!loading && commentList.length === 0 && feedItem" class="empty-state">
        <view class="empty-icon">
          <view class="empty-circle" />
          <view class="empty-bar" />
        </view>
        <text class="empty-text">还没有评论，快来抢沙发</text>
      </view>

      <!-- 评论列表 -->
      <template v-else-if="commentList.length > 0">
        <view class="comment-list">
          <view v-for="comment in commentList" :key="comment.id" class="comment-item">
            <!-- 头像 -->
            <view class="cm-avatar">
              <view class="cm-avatar-inner">
                <view class="cm-avatar-head" />
                <view class="cm-avatar-body" />
              </view>
            </view>
            <!-- 主体 -->
            <view class="comment-main">
              <text class="comment-author">{{ comment.authorName }}</text>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-foot">
                <text class="comment-time">{{ formatTime(comment.createdAt) }}</text>
                <view class="foot-actions">
                  <view class="like-btn" hover-class="like-hover" :hover-stay-time="80" @tap="onCommentLike(comment)">
                    <view class="cm-heart" :class="{ liked: comment.liked }">
                      <view class="cm-heart-l" />
                      <view class="cm-heart-r" />
                      <view class="cm-heart-b" />
                    </view>
                    <text class="like-count" :class="{ liked: comment.liked }">{{ comment.likes + (comment.liked ? 1 : 0) }}</text>
                  </view>
                  <view class="reply-btn" hover-class="reply-hover" :hover-stay-time="80" @tap="onReply(comment)">
                    <text class="reply-text">回复</text>
                  </view>
                </view>
              </view>

              <!-- 回复列表（楼中楼） -->
              <view v-if="comment.replies.length > 0" class="reply-list">
                <view v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                  <view class="reply-content">
                    <text class="reply-author">{{ reply.authorName }}</text>
                    <text v-if="reply.replyToName" class="reply-to"> 回复 @{{ reply.replyToName }}</text>
                    <text class="reply-colon">：</text>
                    <text class="reply-text-content">{{ reply.content }}</text>
                  </view>
                  <view class="reply-foot">
                    <text class="reply-time">{{ formatTime(reply.createdAt) }}</text>
                    <view class="reply-actions">
                      <view class="like-btn small" hover-class="like-hover" :hover-stay-time="80" @tap="onReplyLike(reply)">
                        <view class="cm-heart" :class="{ liked: reply.liked }">
                          <view class="cm-heart-l" />
                          <view class="cm-heart-r" />
                          <view class="cm-heart-b" />
                        </view>
                        <text class="like-count" :class="{ liked: reply.liked }">{{ reply.likes + (reply.liked ? 1 : 0) }}</text>
                      </view>
                      <view class="reply-btn" hover-class="reply-hover" :hover-stay-time="80" @tap="onReply(comment, reply)">
                        <text class="reply-text">回复</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

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

    <!-- 底部输入栏 -->
    <view class="input-bar">
      <view class="input-bar-inner">
        <view v-if="replyTarget" class="reply-hint">
          <text class="reply-hint-text">回复 @{{ replyTarget.replyToName }}</text>
          <view class="cancel-reply" hover-class="cancel-hover" :hover-stay-time="80" @tap="exitReply">
            <text class="cancel-text">×</text>
          </view>
        </view>
        <view class="input-row">
          <input
            v-model="inputText"
            class="comment-input"
            type="text"
            :placeholder="replyTarget ? '回复 @' + replyTarget.replyToName : '写下你的评论...'"
            placeholder-style="color: #bbb"
            confirm-type="send"
            @confirm="onSend"
          />
          <view
            class="send-btn"
            :class="{ disabled: !inputText.trim() || sending }"
            hover-class="send-hover"
            :hover-stay-time="80"
            @tap="onSend"
          >
            <text class="send-text">发送</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { getFeedById, toggleLike } from '@/api/feed'
import type { FeedItem } from '@/api/feed'
import { fetchComments, addComment, addReply, toggleCommentLike, toggleReplyLike } from '@/api/comment'
import type { Comment, Reply } from '@/api/comment'
import FeedCard from '@/components/FeedCard.vue'

const feedId = ref(0)
const feedItem = ref<FeedItem | null>(null)
const commentList = ref<Comment[]>([])
const loading = ref(false)
const hasMore = ref(true)
const total = ref(0)
const page = reactive({ page: 1, pageSize: 10 })
const topbarHeight = 88

const inputText = ref('')
const sending = ref(false)

interface ReplyTarget {
  commentId: number
  replyToName: string
}
const replyTarget = ref<ReplyTarget | null>(null)

/* ---- 初始化 ---- */
onLoad((options) => {
  const id = Number((options as any)?.id)
  if (id) {
    feedId.value = id
    init()
  }
})

async function init() {
  // 并行加载原帖与评论
  getFeedById(feedId.value).then(item => { feedItem.value = item })
  await loadComments(true)
}

/* ---- 加载评论 ---- */
async function loadComments(reset = false) {
  if (loading.value) return
  loading.value = true
  if (reset) {
    page.page = 1
    hasMore.value = true
  }
  const result = await fetchComments({ feedId: feedId.value, page: page.page, pageSize: page.pageSize })
  if (reset) {
    commentList.value = result.list
  } else {
    commentList.value.push(...result.list)
  }
  total.value = result.total
  hasMore.value = result.hasMore
  page.page++
  loading.value = false
}

/* ---- 上拉加载 ---- */
onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    loadComments(false)
  }
})

/* ---- 原帖事件 ---- */
function onPostLike(item: FeedItem) {
  item.liked = !item.liked
  toggleLike(item.id, item.liked)
}
function onPostComment(_item: FeedItem) {
  // 已在评论页，评论入口不跳转
}
function onPostShare(_item: FeedItem) {
  uni.showToast({ title: '转发功能开发中', icon: 'none' })
}
function onPostFollow(_id: number) {
  uni.showToast({ title: '关注成功', icon: 'none' })
}
function onPostVote(_pollId: number, _optionId: number) {
  // 预留投票接口
}

/* ---- 评论点赞 ---- */
function onCommentLike(comment: Comment) {
  comment.liked = !comment.liked
  toggleCommentLike(comment.id, comment.liked)
}
function onReplyLike(reply: Reply) {
  reply.liked = !reply.liked
  toggleReplyLike(reply.id, reply.liked)
}

/* ---- 回复 ---- */
function onReply(comment: Comment, reply?: Reply) {
  replyTarget.value = {
    commentId: comment.id,
    replyToName: reply ? reply.authorName : comment.authorName,
  }
}

function exitReply() {
  replyTarget.value = null
  inputText.value = ''
}

/* ---- 发送 ---- */
async function onSend() {
  const content = inputText.value.trim()
  if (!content || sending.value) return
  sending.value = true
  try {
    if (replyTarget.value) {
      const target = replyTarget.value
      const newReply = await addReply(target.commentId, content, target.replyToName)
      const parent = commentList.value.find(c => c.id === target.commentId)
      if (parent) {
        parent.replies.push(newReply)
      }
    } else {
      const newComment = await addComment(feedId.value, content)
      commentList.value.unshift(newComment)
      total.value++
    }
    inputText.value = ''
    replyTarget.value = null
  } finally {
    sending.value = false
  }
}

/* ---- 返回 ---- */
function onBack() {
  uni.navigateBack({ delta: 1 })
}

/* ---- 时间格式化 ---- */
function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = diff / 3600000
  if (hours < 1) return Math.floor(diff / 60000) + '分钟前'
  if (hours < 24) return Math.floor(hours) + '小时前'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
</script>

<style lang="scss">
page {
  background: #f5f5f7;
}

.page {
  min-height: 100vh;
  background: #f5f5f7;
  padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
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

/* ---- 标题 ---- */
.topbar-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  margin-left: 8rpx;
}

/* ---- 内容区 ---- */
.content {
  padding: 20rpx 24rpx;
}

/* ---- 评论数标题 ---- */
.comment-count {
  padding: 24rpx 8rpx 12rpx;
}
.comment-count-text {
  font-size: 24rpx;
  color: #999;
}

/* ---- 评论列表 ---- */
.comment-list {
  display: flex;
  flex-direction: column;
}
.comment-item {
  display: flex;
  flex-direction: row;
  padding: 24rpx 8rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
}

/* ---- 默认头像（纯 CSS 渐变 + 人形） ---- */
.cm-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  padding: 3rpx;
  background: linear-gradient(135deg, #7b5cff, #ff5c9d);
  flex-shrink: 0;
}
.cm-avatar-inner {
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
.cm-avatar-head {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
}
.cm-avatar-body {
  width: 46rpx;
  height: 20rpx;
  margin-top: 4rpx;
  border-radius: 23rpx 23rpx 0 0;
  background: rgba(255, 255, 255, 0.96);
}

/* ---- 评论主体 ---- */
.comment-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 20rpx;
}
.comment-author {
  font-size: 26rpx;
  font-weight: 600;
  color: #7b5cff;
}
.comment-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-top: 8rpx;
}
.comment-foot {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}
.comment-time {
  font-size: 22rpx;
  color: #999;
}
.foot-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.like-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6rpx 8rpx;
}
.like-hover {
  opacity: 0.6;
}
.reply-btn {
  padding: 6rpx 8rpx;
  margin-left: 24rpx;
}
.reply-hover {
  opacity: 0.6;
}
.reply-text {
  font-size: 22rpx;
  color: #7b5cff;
}
.like-count {
  font-size: 22rpx;
  color: #999;
  margin-left: 8rpx;
}
.like-count.liked {
  color: #ff5c9d;
  font-weight: 600;
}

/* ---- 心形点赞图标（两圆 + 旋转方块，纯填充） ---- */
.cm-heart {
  position: relative;
  width: 28rpx;
  height: 24rpx;

  .cm-heart-l,
  .cm-heart-r {
    position: absolute;
    top: 0;
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #bbb;
  }

  .cm-heart-l {
    left: 0;
  }

  .cm-heart-r {
    right: 0;
  }

  /* top:4 → 方块中心 y=12，底部尖角 y≈23.3 不溢出 24rpx 容器 */
  .cm-heart-b {
    position: absolute;
    top: 4rpx;
    left: 50%;
    width: 16rpx;
    height: 16rpx;
    margin-left: -8rpx;
    background: #bbb;
    transform: rotate(45deg);
  }

  &.liked {
    .cm-heart-l,
    .cm-heart-r,
    .cm-heart-b {
      background: #ff5c9d;
    }
  }
}

/* ---- 回复列表（楼中楼） ---- */
.reply-list {
  margin-top: 16rpx;
  padding: 12rpx 16rpx;
  background: rgba(123, 92, 255, 0.04);
  border-left: 2rpx solid rgba(123, 92, 255, 0.3);
  border-radius: 0 8rpx 8rpx 0;
}
.reply-item {
  padding: 8rpx 0;
}
.reply-content {
  font-size: 26rpx;
  line-height: 1.6;
  color: #333;
}
.reply-author {
  color: #7b5cff;
  font-weight: 600;
}
.reply-to {
  color: #999;
  font-size: 24rpx;
}
.reply-colon {
  color: #333;
}
.reply-text-content {
  color: #333;
}
.reply-foot {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 4rpx;
}
.reply-time {
  font-size: 20rpx;
  color: #bbb;
}
.reply-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.like-btn.small {
  padding: 4rpx 6rpx;

  .cm-heart {
    width: 24rpx;
    height: 20rpx;

    .cm-heart-l,
    .cm-heart-r {
      width: 14rpx;
      height: 14rpx;
    }

    .cm-heart-b {
      width: 14rpx;
      height: 14rpx;
      margin-left: -7rpx;
      top: 3rpx;
    }
  }
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

/* ---- 底部输入栏 ---- */
.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.98);
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.input-bar-inner {
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
}
.reply-hint {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
  padding: 8rpx 16rpx;
  background: rgba(123, 92, 255, 0.06);
  border-radius: 8rpx;
}
.reply-hint-text {
  font-size: 24rpx;
  color: #7b5cff;
}
.cancel-reply {
  width: 36rpx;
  height: 36rpx;
  @include flex-center;
}
.cancel-hover {
  opacity: 0.6;
}
.cancel-text {
  font-size: 36rpx;
  color: #999;
  line-height: 1;
}
.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment-input {
  flex: 1;
  height: 72rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
  background: #f0f0f2;
  border-radius: 36rpx;
}
.send-btn {
  margin-left: 16rpx;
  padding: 0 32rpx;
  height: 72rpx;
  @include flex-center;
  border-radius: 36rpx;
  background: linear-gradient(90deg, #7b5cff 0%, #b750ff 50%, #ff5c9d 100%);

  &.disabled {
    opacity: 0.5;
  }
}
.send-hover {
  opacity: 0.85;
  transform: scale(0.97);
}
.send-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}
</style>
