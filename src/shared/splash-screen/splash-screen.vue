<template>
  <div :class="$style.wrap">
    <div :class="$style.mask">
      <div :class="$style.maskin" />
    </div>
    <div :class="$style.logo">
      <img src="../../assets/img/logo.png" alt="" title="" />
    </div>
    <div :class="$style.progressbar" />
    <div :class="$style.message">{{ title }}</div>
  </div>
</template>

<script lang="ts">
/**
 * splash-screen（启动界面）
 * 该视图将会被注入到 entry html 中用于首屏渲染，提升用户体验
 */
import { defineComponent } from 'vue';

import { ENV } from '@/app/constants';

export default defineComponent({
  setup() {
    return {
      title: ENV.APP_TITLE
    };
  }
});
</script>

<style lang="scss" module>
.wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}

.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}

.maskin {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  margin: -448px -400px 0;
  background: #eee;
  border-radius: 50%;
  transform: scale(0);
  animation: a-h 0.5s linear 1.25s 1 forwards, a-nt 0.6s cubic-bezier(0, 0, 0.2, 1) 1.25s 1;
}

.logo {
  filter: grayscale(80%);
  opacity: 0;
  transform: scale(0.68);
  animation: a-s 0.5s linear 0.5s 1 forwards, a-e 1.75s cubic-bezier(0, 0, 0.67, 1) 0.5s 1 forwards;

  .img {
    width: 160px;
  }
}

.progressbar {
  position: relative;
  width: 66%;
  max-width: 300px;
  height: 4px;
  margin-top: 40px;
  overflow: hidden;
  background-color: #f1f1f1;
  opacity: 0;
  animation: a-s 0.5s 2.5s 1 forwards;
}

.progressbar::before {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  content: '';
  background-color: #1976d2;
  transform: translateX(-300px);
  animation: a-lb 20s linear 3s forwards;
}

.message {
  position: relative;
  margin-top: 50px;
  font-size: 20px;
  line-height: 15px;
  opacity: 0;
  animation: a-s 0.5s 2.5s 1 forwards;
}

.ellipsis {
  position: absolute;
  top: 0;
  right: -20px;
  width: 15px;
  margin-left: 2px;
}

.ellipsis::after {
  display: inline-block;
  width: 0;
  overflow: hidden;
  content: '\2026';
  -webkit-animation: ellipsis 3s steps(4) infinite;
  animation: ellipsis 3s steps(4) infinite;
}

@-webkit-keyframes ellipsis {
  to {
    width: 15px;
  }
}

@keyframes ellipsis {
  to {
    width: 15px;
  }
}

@-webkit-keyframes a-e {
  43% {
    transform: scale(0.75);
    animation-timing-function: cubic-bezier(0.8, 0, 0.2, 1);
  }

  60% {
    transform: translateY(-16px);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  77% {
    transform: none;
    animation-timing-function: cubic-bezier(0.16, 0, 0.2, 1);
  }

  89% {
    transform: translateY(-5px);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  to {
    filter: grayscale(0);
    transform: none;
  }
}

@keyframes a-e {
  43% {
    transform: scale(0.75);
    animation-timing-function: cubic-bezier(0.8, 0, 0.2, 1);
  }

  60% {
    transform: translateY(-16px);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  77% {
    transform: none;
    animation-timing-function: cubic-bezier(0.16, 0, 0.2, 1);
  }

  89% {
    transform: translateY(-5px);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  to {
    filter: grayscale(0);
    transform: none;
  }
}

@-webkit-keyframes a-lb {
  0% {
    transform: translateX(-300px);
  }

  10% {
    transform: translateX(-50px);
  }

  15% {
    transform: translateX(-30px);
  }

  25% {
    transform: translateX(-30px);
  }

  30% {
    transform: translateX(-20px);
  }

  45% {
    transform: translateX(-20px);
  }

  50% {
    transform: translateX(-15px);
  }

  65% {
    transform: translateX(-14px);
  }

  70% {
    transform: translateX(-13px);
  }

  75% {
    transform: translateX(-12px);
  }

  80% {
    transform: translateX(-11px);
  }

  85% {
    transform: translateX(-10px);
  }

  95% {
    transform: translateX(-8px);
  }

  98% {
    transform: translateX(-6px);
  }

  to {
    transform: translateX(-5px);
  }
}

@keyframes a-lb {
  0% {
    transform: translateX(-300px);
  }

  10% {
    transform: translateX(-50px);
  }

  15% {
    transform: translateX(-30px);
  }

  25% {
    transform: translateX(-30px);
  }

  30% {
    transform: translateX(-20px);
  }

  45% {
    transform: translateX(-20px);
  }

  50% {
    transform: translateX(-15px);
  }

  65% {
    transform: translateX(-14px);
  }

  70% {
    transform: translateX(-13px);
  }

  75% {
    transform: translateX(-12px);
  }

  80% {
    transform: translateX(-11px);
  }

  85% {
    transform: translateX(-10px);
  }

  95% {
    transform: translateX(-8px);
  }

  98% {
    transform: translateX(-6px);
  }

  to {
    transform: translateX(-5px);
  }
}

@-webkit-keyframes a-s {
  to {
    opacity: 1;
  }
}

@keyframes a-s {
  to {
    opacity: 1;
  }
}

@-webkit-keyframes a-h {
  to {
    opacity: 0;
  }
}

@keyframes a-h {
  to {
    opacity: 0;
  }
}

@-webkit-keyframes a-nt {
  to {
    transform: none;
  }
}

@keyframes a-nt {
  to {
    transform: none;
  }
}
</style>
