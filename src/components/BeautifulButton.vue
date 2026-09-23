<template>
    <view class="btn-wrap">
        <view
            class="btn-login"
            :class="{ clicking }"
            hover-class="btn-hover"
            :hover-stay-time="80"
            @tap="onBtnTap"
        >
            <slot>
                <text class="btn-text"><slot name="text" /></text>
            </slot>
        </view>
        <!-- 粒子爆发层：8 向彩色光点飞散（数组遍历，避免数字 v-for 的编译器兼容问题） -->
        <view v-if="burstKey > 0" :key="burstKey" class="btn-burst">
            <view
                v-for="i in rayIndexes"
                :key="i"
                class="ray"
                :class="'ray' + i"
            >
                <view
                    class="particle"
                    :class="['pc' + (i % 4), i % 2 === 0 ? 'pt-near' : 'pt-far']"
                />
            </view>
        </view>
    </view>
</template>

<style lang="scss">
/* ---- 登录按钮（循环流光 + 点击动效） ---- */
.btn-wrap {
    position: relative;
    margin-top: 44rpx;
}
.btn-login {
  @include flex-center;
  position: relative;
  overflow: hidden;
  height: 100rpx;
  border-radius: 50rpx;
  background: $button-gradient;
  box-shadow: 0 16rpx 40rpx rgba($focus-ring, 0.45);

    /* 循环流光 */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -60%;
        width: 40%;
        height: 100%;
        transform: skewX(-20deg);
        background: linear-gradient(105deg, transparent, rgba(255, 255, 255, 0.35), transparent);
        animation: shine 2.8s ease-in-out infinite;
    }

    /* 点击：过冲回弹 + 渐变涌动 */
    &.clicking {
        animation: btn-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), btn-flow 0.7s ease-out;
    }
}
.btn-hover {
    transform: scale(0.97);
    opacity: 0.9;
}
.btn-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    letter-spacing: 12rpx;
}
@keyframes shine {
    0% { left: -60%; }
    60%, 100% { left: 120%; }
}
@keyframes btn-pop {
    0% { transform: scale(1); }
    25% { transform: scale(0.9); }
    65% { transform: scale(1.06); }
    100% { transform: scale(1); }
}
@keyframes btn-flow {
    0% { background-size: 100% 100%; background-position: 0% 0%; }
    40% { background-size: 260% 100%; background-position: 100% 0%; }
    100% { background-size: 100% 100%; background-position: 0% 0%; }
}

/* ---- 点击动效：8 向彩色粒子爆发 ---- */
.btn-burst {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    pointer-events: none;
}
.ray {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
}
/* 8 条射线按 45° 均分生成 */
@for $i from 1 through 8 {
    .ray#{$i} {
        transform: rotate(($i - 1) * 45deg);
    }
}
.particle {
    position: absolute;
    top: 0;
    left: 0;
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    box-shadow: 0 0 12rpx currentColor;
}
/* 四色粒子 */
.pc0 { background: $brand-pink; color: $brand-pink; }
.pc1 { background: $brand-purple; color: $brand-purple; }
.pc2 { background: $brand-blue; color: $brand-blue; }
.pc3 { background: $brand-gold; color: $brand-gold; }
.pt-far {
  animation: burst-far 0.7s cubic-bezier(0.15, 0.85, 0.4, 1) forwards;
}
.pt-near {
  animation: burst-near 0.7s cubic-bezier(0.15, 0.85, 0.4, 1) 0.04s forwards;
}
@keyframes burst-far {
  0% { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) translateY(-170rpx) scale(0.25); opacity: 0; }
}
@keyframes burst-near {
  0% { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) translateY(-110rpx) scale(0.25); opacity: 0; }
}
</style>

<script setup lang="ts">
import { ref, } from 'vue';

const emits = defineEmits(['tap']);

/**
 * 点击按钮
 */
function onBtnTap() {
    animate();
    emits('tap');
}


const burstKey = ref(0);

// 8 条粒子射线方向索引
const rayIndexes = [1, 2, 3, 4, 5, 6, 7, 8];
const clicking = ref(false);
let popTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 点击动效：粒子爆发 + 渐变涌动 + 过冲回弹
 */
function animate() {
    burstKey.value ++;
    clicking.value = false;
    setTimeout(() => { clicking.value = true }, 30);
    if (popTimer) {
        clearTimeout(popTimer);
    }
    popTimer = setTimeout(() => {
        clicking.value = false;
        burstKey.value = 0;
    }, 720);
}
</script>
