<template>
    <!-- 背景光斑 -->
    <view class="orb orb-1" />
    <view class="orb orb-2" />
    <view class="orb orb-3" />
    <!-- 星星点缀 -->
    <view
        v-for="(s, i) in stars"
        :key="i"
        class="star"
        :style="{
            top: s.top,
            left: s.left,
            width: s.size + 'px',
            height: s.size + 'px',
            animationDelay: s.delay + 's',
            animationDuration: s.duration + 's'
        }"
    />
</template>
<style lang="scss" scoped>
/* ---- 背景光斑 ---- */
.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(0);
    opacity: 0.55;
    animation: orb-float 9s ease-in-out infinite;

    &-1 {
        width: 420rpx;
        height: 420rpx;
        top: -100rpx;
        left: -120rpx;
        background: radial-gradient(circle at 35% 35%, rgba($focus-purple, 0.55), rgba($focus-purple, 0) 68%);
    }

    &-2 {
        width: 360rpx;
        height: 360rpx;
        top: 30%;
        right: -140rpx;
        background: radial-gradient(circle at 60% 40%, rgba($brand-pink, 0.45), rgba($brand-pink, 0) 68%);
        animation-delay: 2.6s;
    }

    &-3 {
        width: 460rpx;
        height: 460rpx;
        bottom: -140rpx;
        left: 22%;
        background: radial-gradient(circle at 50% 45%, rgba(91, 124, 255, 0.4), rgba(91, 124, 255, 0) 70%);
        animation-delay: 5s;
    }
}
@keyframes orb-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(24rpx, -30rpx) scale(1.08); }
}

/* ---- 星星 ---- */
.star {
    position: absolute;
    border-radius: 50%;
    background: #ffffff;
    opacity: 0.7;
    animation: twinkle 2.6s ease-in-out infinite;
}
@keyframes twinkle {
    0%, 100% { opacity: 0.15; transform: scale(0.8); }
    50% { opacity: 0.9; transform: scale(1.15); }
}
</style>

<script setup lang="ts">
const stars = [
    { top: '8%', left: '12%', size: 3, delay: 0, duration: 2.6 },
    { top: '15%', left: '78%', size: 2, delay: 0.6, duration: 3.2 },
    { top: '26%', left: '8%', size: 2, delay: 1.1, duration: 2.8 },
    { top: '32%', left: '88%', size: 3, delay: 0.3, duration: 3.6 },
    { top: '45%', left: '16%', size: 2, delay: 1.6, duration: 2.4 },
    { top: '52%', left: '70%', size: 2, delay: 0.9, duration: 3.0 },
    { top: '64%', left: '86%', size: 2, delay: 1.3, duration: 2.7 },
    { top: '70%', left: '6%', size: 3, delay: 0.4, duration: 3.4 },
];
</script>