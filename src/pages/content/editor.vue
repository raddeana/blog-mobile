<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="topbar">
      <view class="topbar-inner">
        <view class="back-btn" hover-class="back-hover" :hover-stay-time="80" @tap="onBack">
          <view class="back-arrow" />
        </view>
        <text class="topbar-title">{{ isEdit ? '编辑内容' : '新建内容' }}</text>
        <view
          class="save-btn"
          :class="{ disabled: saving }"
          hover-class="save-hover"
          :hover-stay-time="80"
          @tap="onSave"
        >
          <text class="save-text">{{ saving ? '保存中' : '保存' }}</text>
        </view>
      </view>
    </view>

    <!-- 编辑区 -->
    <view class="editor-body" :style="{ paddingTop: topbarHeight + 'px' }">
      <!-- 类型选择器 -->
      <view class="type-selector">
        <view
          v-for="t in typeOptions"
          :key="t.value"
          class="type-tab"
          :class="{ active: form.type === t.value, disabled: isEdit }"
          @tap="switchType(t.value)"
        >
          <text class="type-tab-text">{{ t.label }}</text>
        </view>
      </view>

      <!-- 文章：标题 -->
      <view v-if="form.type === 'article'" class="field-block">
        <input
          class="title-input"
          v-model="form.title"
          placeholder="请输入文章标题"
          placeholder-class="ph"
          maxlength="50"
        />
      </view>

      <!-- 文章/投票：富文本工具栏 + editor -->
      <template v-if="form.type !== 'message'">
        <view class="rich-toolbar">
          <view class="tb-btn bold" hover-class="tb-hover" :hover-stay-time="60" @tap="format('bold')">
            <text class="tb-glyph">B</text>
          </view>
          <view class="tb-btn italic" hover-class="tb-hover" :hover-stay-time="60" @tap="format('italic')">
            <text class="tb-glyph ti">I</text>
          </view>
          <view class="tb-btn underline" hover-class="tb-hover" :hover-stay-time="60" @tap="format('underline')">
            <text class="tb-glyph un">U</text>
          </view>
          <view class="tb-btn image" hover-class="tb-hover" :hover-stay-time="60" @tap="insertImage">
            <view class="ic-img">
              <view class="img-rect" />
              <view class="img-mount" />
              <view class="img-sun" />
            </view>
          </view>
        </view>

        <editor
          id="theEditor"
          class="rich-editor"
          placeholder="请输入正文内容..."
          @ready="onEditorReady"
          @input="onEditorInput"
        />
      </template>

      <!-- 投票字数计数器 -->
      <view v-if="form.type === 'poll'" class="char-counter" :class="{ overflow: pollCharCount > 500 }">
        <text class="counter-text">{{ pollCharCount }} / 500</text>
      </view>

      <!-- 短消息：textarea + 计数器 -->
      <view v-if="form.type === 'message'" class="field-block">
        <textarea
          class="message-input"
          v-model="form.body"
          placeholder="说点什么吧，不超过 200 字..."
          placeholder-class="ph"
          maxlength="200"
          :auto-height="true"
        />
        <view class="char-counter" :class="{ overflow: messageCharCount >= 200 }">
          <text class="counter-text">{{ messageCharCount }} / 200</text>
        </view>
      </view>

      <!-- 投票：选项编辑器 -->
      <view v-if="form.type === 'poll'" class="field-block">
        <text class="section-label">投票选项</text>
        <view class="options-editor">
          <view
            v-for="(opt, i) in form.pollOptions"
            :key="opt.id"
            class="option-row"
          >
            <view class="opt-index">
              <text class="opt-index-text">{{ i + 1 }}</text>
            </view>
            <input
              class="opt-input"
              v-model="opt.text"
              :placeholder="`选项 ${i + 1}`"
              placeholder-class="ph"
              maxlength="30"
            />
            <view
              v-if="form.pollOptions.length > 2"
              class="opt-remove"
              hover-class="opt-hover"
              :hover-stay-time="60"
              @tap="removeOption(i)"
            >
              <view class="rm-h" />
              <view class="rm-v" />
            </view>
          </view>
          <view class="opt-add" hover-class="add-hover" :hover-stay-time="60" @tap="addOption">
            <view class="add-plus">
              <view class="add-h" />
              <view class="add-v" />
            </view>
            <text class="add-text">添加选项</text>
          </view>
        </view>
      </view>

      <!-- 媒体附件区（文章：视频+音频；短消息：图片） -->
      <view v-if="form.type !== 'poll'" class="field-block">
        <text class="section-label">{{ form.type === 'article' ? '音视频附件' : '配图' }}</text>
        <view class="media-grid">
          <!-- 已选媒体 -->
          <view v-for="(m, i) in form.medias" :key="m.id" class="media-item">
            <image v-if="m.type === 'image'" class="media-thumb" :src="m.url" mode="aspectFill" />
            <view v-else class="media-placeholder" :class="m.type">
              <view v-if="m.type === 'video'" class="ph-play">
                <view class="play-tri" />
              </view>
              <view v-else class="ph-note">
                <view class="note-dot" />
                <view class="note-bar" />
              </view>
              <text class="ph-label">{{ mediaTypeLabel(m.type) }}</text>
            </view>
            <view class="media-remove" hover-class="rm-btn-hover" :hover-stay-time="60" @tap="removeMedia(i)">
              <view class="rm-btn-h" />
              <view class="rm-btn-v" />
            </view>
          </view>
          <!-- 添加按钮 -->
          <view v-if="form.type === 'message'" class="media-add" hover-class="add-tile-hover" :hover-stay-time="60" @tap="chooseMedia('image')">
            <view class="add-plus small">
              <view class="add-h" />
              <view class="add-v" />
            </view>
            <text class="add-tile-text">图片</text>
          </view>
          <template v-if="form.type === 'article'">
            <view class="media-add" hover-class="add-tile-hover" :hover-stay-time="60" @tap="chooseMedia('video')">
              <view class="add-plus small">
                <view class="add-h" />
                <view class="add-v" />
              </view>
              <text class="add-tile-text">视频</text>
            </view>
            <view class="media-add" hover-class="add-tile-hover" :hover-stay-time="60" @tap="chooseMedia('audio')">
              <view class="add-plus small">
                <view class="add-h" />
                <view class="add-v" />
              </view>
              <text class="add-tile-text">音频</text>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, getCurrentInstance, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  getContentById,
  createContent,
  updateContent,
  uploadMedia,
} from '@/api/content'
import type { ContentType, MediaItem, PollOptionInput, CreateContentInput } from '@/api/content'
import {
  charCount,
  validatePollOptions,
  validateMessageBody,
  mediaTypeLabel,
} from '@/utils/content-logic'

const instance = getCurrentInstance()

const isEdit = ref(false)
const editingId = ref(0)
const topbarHeight = 88
const saving = ref(false)

const editorCtx = ref<UniApp.EditorContext | null>(null)
const editorReady = ref(false)
const pendingHtml = ref('')

const typeOptions = [
  { value: 'article' as ContentType, label: '文章' },
  { value: 'message' as ContentType, label: '短消息' },
  { value: 'poll' as ContentType, label: '投票' },
]

const form = reactive({
  type: 'article' as ContentType,
  title: '',
  body: '',
  medias: [] as MediaItem[],
  pollOptions: [] as PollOptionInput[],
})

const pollCharCount = computed(() => charCount(form.body))
const messageCharCount = computed(() => form.body.length)

onLoad((options) => {
  const o = (options || {}) as { type?: string; id?: string }
  if (o.type) form.type = o.type as ContentType
  if (o.id) {
    isEdit.value = true
    editingId.value = Number(o.id)
    loadExisting(Number(o.id))
  } else {
    initForType(form.type)
  }
})

function initForType(t: ContentType) {
  if (t === 'poll' && form.pollOptions.length < 2) {
    form.pollOptions = [
      { id: Date.now(), text: '' },
      { id: Date.now() + 1, text: '' },
    ]
  }
}

async function loadExisting(id: number) {
  const item = await getContentById(id)
  if (!item) {
    uni.showToast({ title: '内容不存在', icon: 'none' })
    setTimeout(onBack, 1000)
    return
  }
  form.type = item.type
  form.title = item.type === 'article' ? item.title : ''
  form.body = item.body
  form.medias = item.type !== 'poll' ? item.medias : []
  form.pollOptions = item.type === 'poll' ? item.pollOptions : []
  if (item.type !== 'message') {
    pendingHtml.value = item.body
    if (editorReady.value && editorCtx.value) {
      nextTick(() => applyEditorHtml())
    }
  }
}

function applyEditorHtml() {
  if (editorCtx.value && pendingHtml.value) {
    editorCtx.value.setContents({ html: pendingHtml.value })
    pendingHtml.value = ''
  }
}

function onEditorReady() {
  editorReady.value = true
  editorCtx.value = (uni as any).createEditorContext('theEditor', instance!.proxy as any)
  if (pendingHtml.value) {
    nextTick(() => applyEditorHtml())
  }
}

function onEditorInput(e: any) {
  form.body = e.detail.html
}

function switchType(t: ContentType) {
  if (isEdit.value || t === form.type) return
  form.type = t
  form.title = ''
  form.body = ''
  form.medias = []
  form.pollOptions = []
  editorCtx.value = null
  editorReady.value = false
  pendingHtml.value = ''
  initForType(t)
}

function format(name: 'bold' | 'italic' | 'underline') {
  (editorCtx.value as any)?.format(name)
}

async function insertImage() {
  try {
    const r = await uni.chooseImage({ count: 1 })
    for (const p of r.tempFilePaths) {
      const m = await uploadMedia({ path: p, type: 'image' })
      editorCtx.value?.insertImage({ src: m.url, alt: '图片', width: '100%' })
    }
  } catch {
    uni.showToast({ title: '插入图片失败', icon: 'none' })
  }
}

async function chooseMedia(t: 'image' | 'video' | 'audio') {
  try {
    if (t === 'image') {
      const r = await uni.chooseImage({ count: 9 })
      for (const p of r.tempFilePaths) {
        form.medias.push(await uploadMedia({ path: p, type: 'image' }))
      }
    } else if (t === 'video') {
      const r = await uni.chooseVideo({ sourceType: ['album', 'camera'] })
      if (r.tempFilePath) form.medias.push(await uploadMedia({ path: r.tempFilePath, type: 'video' }))
    } else {
      const r: any = await (uni as any).chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['mp3', 'wav', 'm4a', 'aac'],
      })
      if (r.tempFiles?.[0]) {
        form.medias.push(await uploadMedia({ path: r.tempFiles[0].path, type: 'audio' }))
      }
    }
  } catch {
    uni.showToast({ title: '选择失败或暂不支持', icon: 'none' })
  }
}

function removeMedia(i: number) {
  form.medias.splice(i, 1)
}

function addOption() {
  form.pollOptions.push({ id: Date.now(), text: '' })
}

function removeOption(i: number) {
  if (form.pollOptions.length <= 2) {
    uni.showToast({ title: '至少保留 2 个选项', icon: 'none' })
    return
  }
  form.pollOptions.splice(i, 1)
}

function buildInput(): CreateContentInput {
  if (form.type === 'article') {
    return { type: 'article', title: form.title, body: form.body, medias: form.medias, status: 'published' }
  }
  if (form.type === 'message') {
    return { type: 'message', body: form.body, medias: form.medias, status: 'published' }
  }
  return { type: 'poll', body: form.body, pollOptions: form.pollOptions, status: 'published' }
}

async function onSave() {
  if (saving.value) return
  if (form.type === 'article' && !form.title.trim()) {
    return uni.showToast({ title: '请填写标题', icon: 'none' })
  }
  if (form.type === 'message') {
    const v = validateMessageBody(form.body)
    if (!v.valid) {
      return uni.showToast({ title: `短消息不超过 200 字（超出 ${v.overflow}）`, icon: 'none' })
    }
  }
  if (form.type === 'poll') {
    if (pollCharCount.value > 500) {
      return uni.showToast({ title: '问题正文不超过 500 字', icon: 'none' })
    }
    const v = validatePollOptions(form.pollOptions)
    if (!v.valid) {
      const msg =
        v.reason === 'empty'
          ? `第 ${(v.emptyIndex ?? 0) + 1} 项不能为空`
          : v.reason === 'too-few'
          ? '至少 2 个选项'
          : `选项"${v.duplicateText}"重复`
      return uni.showToast({ title: msg, icon: 'none' })
    }
  }
  saving.value = true
  try {
    const input = buildInput()
    if (isEdit.value) {
      await updateContent(editingId.value, input as any)
      uni.showToast({ title: '已保存', icon: 'success' })
    } else {
      await createContent(input)
      uni.showToast({ title: '已发布', icon: 'success' })
    }
    setTimeout(onBack, 800)
  } finally {
    saving.value = false
  }
}

function onBack() {
  uni.navigateBack({ delta: 1 })
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
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
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

/* ---- 保存按钮 ---- */
.save-btn {
  padding: 10rpx 28rpx;
  border-radius: 32rpx;
  background: $button-gradient;
  box-shadow: 0 4rpx 12rpx rgba(123, 92, 255, 0.25);
}
.save-btn.disabled {
  opacity: 0.5;
}
.save-hover {
  opacity: 0.85;
  transform: scale(0.96);
}
.save-text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 600;
}

/* ---- 编辑区 ---- */
.editor-body {
  padding: 20rpx 24rpx;
}

/* ---- 类型选择器 ---- */
.type-selector {
  display: flex;
  flex-direction: row;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 16rpx;
  padding: 4rpx;
  margin-bottom: 24rpx;
}
.type-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  border-radius: 12rpx;
  transition: all 0.2s ease;
}
.type-tab.active {
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}
.type-tab.disabled {
  opacity: 0.5;
}
.type-tab-text {
  font-size: 26rpx;
  color: #999;
}
.type-tab.active .type-tab-text {
  color: #7b5cff;
  font-weight: 600;
}

/* ---- 字段块 ---- */
.field-block {
  margin-bottom: 24rpx;
}
.section-label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

/* ---- 标题输入 ---- */
.title-input {
  width: 100%;
  min-height: 80rpx;
  padding: 20rpx 24rpx;
  font-size: 30rpx;
  color: #1a1a1a;
  background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
}
.ph {
  color: #bbb;
}

/* ---- 富文本工具栏 ---- */
.rich-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12rpx 16rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 0 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
}
.tb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  margin-right: 8rpx;
  border-radius: 10rpx;
}
.tb-hover {
  background: rgba(123, 92, 255, 0.08);
}
.tb-glyph {
  font-size: 32rpx;
  color: #333;
}
.tb-btn.bold .tb-glyph {
  font-weight: 800;
}
.tb-btn.italic .tb-glyph {
  font-style: italic;
}
.tb-btn.underline .tb-glyph {
  text-decoration: underline;
}
.tb-btn.image .ic-img {
  display: block;
}

/* 插图图标：山+太阳 */
.ic-img {
  position: relative;
  width: 36rpx;
  height: 36rpx;

  .img-rect {
    width: 36rpx;
    height: 28rpx;
    border: 3rpx solid #333;
    border-radius: 6rpx;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
  }

  .img-mount {
    position: absolute;
    bottom: 3rpx;
    left: 6rpx;
    width: 0;
    height: 0;
    border-left: 8rpx solid transparent;
    border-right: 8rpx solid transparent;
    border-bottom: 10rpx solid #333;
  }

  .img-sun {
    position: absolute;
    top: 0;
    right: 6rpx;
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background: #333;
  }
}

/* ---- 富文本编辑器 ---- */
.rich-editor {
  width: 100%;
  min-height: 320rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  background: #ffffff;
  border-radius: 0 0 16rpx 16rpx;
  box-sizing: border-box;
}

/* ---- 字数计数器 ---- */
.char-counter {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8rpx;
}
.counter-text {
  font-size: 22rpx;
  color: #999;
}
.char-counter.overflow .counter-text {
  color: #ff5c9d;
}

/* ---- 短消息输入 ---- */
.message-input {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #1a1a1a;
  background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
  line-height: 1.6;
}

/* ---- 投票选项编辑器 ---- */
.options-editor {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 8rpx 24rpx;
}
.option-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 88rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
}
.opt-index {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(123, 92, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.opt-index-text {
  font-size: 24rpx;
  color: #7b5cff;
  font-weight: 600;
}
.opt-input {
  flex: 1;
  font-size: 28rpx;
  color: #1a1a1a;
}
.opt-remove {
  position: relative;
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12rpx;
  flex-shrink: 0;
}
.opt-hover {
  opacity: 0.6;
}
.rm-h {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20rpx;
  height: 3rpx;
  margin: -1.5rpx 0 0 -10rpx;
  background: #ff5c9d;
  border-radius: 2rpx;
}
.rm-v {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3rpx;
  height: 20rpx;
  margin: -10rpx 0 0 -1.5rpx;
  background: #ff5c9d;
  border-radius: 2rpx;
  transform: rotate(45deg);
}
.opt-add {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 88rpx;
}
.add-hover {
  opacity: 0.6;
}
.add-plus {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;

  &.small {
    width: 28rpx;
    height: 28rpx;
  }
}
.add-h {
  position: absolute;
  top: 50%;
  left: 0;
  width: 32rpx;
  height: 3rpx;
  margin-top: -1.5rpx;
  background: #7b5cff;
  border-radius: 2rpx;
}
.add-v {
  position: absolute;
  left: 50%;
  top: 0;
  width: 3rpx;
  height: 32rpx;
  margin-left: -1.5rpx;
  background: #7b5cff;
  border-radius: 2rpx;
}
.add-text {
  font-size: 26rpx;
  color: #7b5cff;
}

/* ---- 媒体网格 ---- */
.media-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.media-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  overflow: hidden;
}
.media-thumb {
  width: 100%;
  height: 100%;
}
.media-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &.video {
    background: linear-gradient(135deg, #2b1a5e, #4c2a8a);
  }

  &.audio {
    background: linear-gradient(135deg, #341c6e, #5a3aa8);
  }
}
.ph-play {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-tri {
  width: 0;
  height: 0;
  margin-left: 4rpx;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-left: 16rpx solid #7b5cff;
}
.ph-note {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
.note-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}
.note-bar {
  width: 4rpx;
  height: 28rpx;
  margin-left: -8rpx;
  background: rgba(255, 255, 255, 0.9);
}
.ph-label {
  margin-top: 8rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.85);
}
.media-remove {
  position: absolute;
  top: 4rpx;
  right: 4rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.rm-btn-hover {
  background: rgba(0, 0, 0, 0.7);
}
.rm-btn-h {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18rpx;
  height: 3rpx;
  margin: -1.5rpx 0 0 -9rpx;
  background: #ffffff;
  border-radius: 2rpx;
  transform: rotate(45deg);
}
.rm-btn-v {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3rpx;
  height: 18rpx;
  margin: -9rpx 0 0 -1.5rpx;
  background: #ffffff;
  border-radius: 2rpx;
  transform: rotate(45deg);
}

/* ---- 媒体添加按钮 ---- */
.media-add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  border: 2rpx dashed rgba(123, 92, 255, 0.4);
  background: rgba(123, 92, 255, 0.04);
}
.add-tile-hover {
  background: rgba(123, 92, 255, 0.1);
}
.add-tile-text {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #7b5cff;
}
</style>
