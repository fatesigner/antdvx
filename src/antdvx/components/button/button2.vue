<template>
  <AButton
    :class="[type === '3d' ? 'ant-btn-3d' : null, color ? `ant-color-${color}` : null, outline ? 'ant-btn-outline' : null, pure ? 'ant-btn-pure' : null]"
    :block="block"
    :disabled="disabled"
    :ghost="ghost"
    :htmlType="htmlType"
    :loading="loading"
    :type="type === '3d' ? 'default' : type"
    :size="size"
    :title="title"
    @click="onClick"
  >
    <template v-for="(value, key) in $slots" v-slot:[key]="slotProps">
      <slot :name="key" />
    </template>
  </AButton>
</template>

<script lang="ts">
import { Button } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';

const buttonProps_ = buttonProps();

// const buttonTypes = ['default', 'primary', 'ghost', 'dashed', 'danger', 'link'];

export default defineComponent({
  name: 'antd-button',
  components: { [Button.name]: Button },
  props: {
    ...buttonProps_,
    type: {
      type: String as PropType<'default' | 'primary' | 'ghost' | 'dashed' | 'danger' | 'link' | '3d'>,
      default: 'default'
    },
    pure: {
      type: Boolean,
      default: false
    },
    color: {
      type: String as PropType<'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'purple' | 'dark'>,
      default: null
    },
    outline: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const onClick = (e) => {
      emit('click', e);
    };

    return {
      onClick
    };
  }
});
</script>
