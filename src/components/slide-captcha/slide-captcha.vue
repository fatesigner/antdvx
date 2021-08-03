<template>
  <div
    ref="wrap"
    :class="[$style.wrap, valid ? $style.valid : null]"
    :title="valid ? $t(i18nMessages.antd.slideCaptcha.validText) : $t(i18nMessages.antd.slideCaptcha.tip)"
    @click="presentCaptchaModal"
  >
    <template v-if="valid">
      <div :class="$style.being">
        <icon-check-blod scale="1.2" />
      </div>
      <div :class="$style.tip" :title="$t(i18nMessages.antd.slideCaptcha.validText)">
        {{ $t(i18nMessages.antd.slideCaptcha.validText) }}
      </div>
    </template>
    <template v-else>
      <div :class="$style.ready">
        <div :class="$style.ring"></div>
        <div :class="$style.dot"></div>
      </div>
      <div :class="$style.tip">
        {{ $t(i18nMessages.antd.slideCaptcha.tip) }}
      </div>
    </template>
    <div :class="$style.successful"></div>
  </div>
  <teleport to="body">
    <div :class="$style.mask" v-if="presented" @click="dismissCaptchaModal" />
    <slide-modal v-if="presented" :theme="theme" :position="position" @close="dismissCaptchaModal" @failed="onFailed" @successful="onSuccessful" />
  </teleport>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, ref, watch } from 'vue';

import { IconCheckBlod } from '../iconfont';
import { i18nMessages } from '../../i18n/messages';

import SlideModal from './slide-modal.vue';

export default defineComponent({
  name: 'SlideCaptcha',
  components: {
    SlideModal,
    IconCheckBlod
  },
  props: {
    theme: {
      type: String as PropType<'dark' | 'light'>,
      default: null
    },
    images: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    valid: {
      type: Boolean,
      default: false
    },
    presented: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const wrap = ref(null);
    const handing = ref(false);
    const presented = ref(false);
    const valid = ref(false);

    /*const modalOffset = {
      top: 22.5,
      left: 48
    };*/

    const position = reactive({ top: 0, left: 0 });

    watch(
      () => props.presented,
      (val) => {
        if (val) {
          presentCaptchaModal();
        } else {
          dismissCaptchaModal();
        }
      }
    );

    watch(
      () => props.valid,
      (val) => {
        if (!val) {
          valid.value = false;
        }
      }
    );

    const getCaptchaModalPosition = () => {
      if (wrap.value) {
        const rect = wrap.value.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        return {
          top: top,
          left: left
        };
      }
      return {
        top: 0,
        left: 0
      };
    };

    // Present captcha modal
    const presentCaptchaModal = () => {
      if (valid.value) {
        return;
      }
      let _p = getCaptchaModalPosition();
      position.top = _p.top;
      position.left = _p.left;
      presented.value = true;
      emit('update:presented', true);
    };

    // Dismiss captcha modal
    const dismissCaptchaModal = () => {
      presented.value = false;
      emit('update:presented', false);
    };

    const onFailed = () => {
      emit('update:valid', false);
      valid.value = false;
    };

    const onSuccessful = () => {
      dismissCaptchaModal();
      emit('update:valid', true);
      valid.value = true;
    };

    return {
      wrap,
      i18nMessages,
      handing,
      presented,
      valid,
      position,
      presentCaptchaModal,
      dismissCaptchaModal,
      onFailed,
      onSuccessful
    };
  }
});
</script>

<style lang="scss" module>
.wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 37px;
  padding: 0 18px 0 8px;
  cursor: pointer;
  border: 1px solid #f6ca9d;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9f9f9;
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.being {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
}

.ready {
  position: relative;
  width: 26px;
  height: 26px;

  .dot {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f6ca9d;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px #f6ca9d;
    transform: scale(0.4);
  }

  .ring {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 50%, #fff 50%), linear-gradient(to right, #fff 50%, rgba(0, 0, 0, 0) 50%);
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px #f6ca9d;
    transform: scale(1);
    animation: mi-anim-wait 1s infinite;
  }
}

.tip {
  margin-left: 10px;
  overflow: hidden;
  color: #1d1e23;
  text-overflow: ellipsis;
  letter-spacing: 0.125rem;
  white-space: nowrap;
}

.successful {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  cursor: default;
  box-shadow: 0 0 4px rgb(246 202 157 / 20%);
  transition: width 500ms ease;
}

.valid {
  border-color: #52c41a;

  .being {
    color: green;
  }

  .successful {
    width: 100%;
    background-color: rgb(163 255 190 / 20%);
  }
}

@keyframes mi-anim-wait {
  60% {
    transform: scale(0.75);
  }
}
</style>
