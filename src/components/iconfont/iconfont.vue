<template>
  <component :is="comp" v-bind="$props" />
</template>

<script lang="ts">
import { PropType, defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  name: 'iconfont',
  props: {
    name: {
      type: String,
      default: null
    },
    color: {
      type: String as PropType<'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'purple' | 'dark'>,
      default: null
    },
    style: {
      type: Object,
      default: null
    },
    scale: {
      type: [Number, String],
      default: null
    },
    spin: {
      type: Boolean,
      default: false
    },
    rotate: {
      type: Number,
      default: null
    },
    twoToneColor: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const comp = props.name
      ? defineAsyncComponent(() =>
          import(`./icons/${props.name}`).then((res) => {
            return res.default;
          })
        )
      : null;

    return {
      comp
    };
  }
});
</script>

<style lang="scss" module></style>
