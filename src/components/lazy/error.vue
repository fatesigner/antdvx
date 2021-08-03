<template>
  <div :class="$style.wrap" ref="wrap">
    <AAlert type="error" show-icon>
      <template #description>{{ error }}</template>
    </AAlert>
  </div>
</template>

<script lang="ts">
import { Alert } from 'ant-design-vue';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  components: {
    // Antd
    [Alert.name]: Alert
  },
  props: {
    error: String
  },
  setup() {
    const $wrap = ref(null);

    onMounted(() => {
      if ($wrap.value && $wrap.value.parentElement) {
        $wrap.value.style.width = $wrap.value.parentElement.offsetWidth + 'px';
        $wrap.value.style.height = $wrap.value.parentElement.offsetHeight + 'px';
      }
    });

    return {
      wrap: $wrap
    };
  }
});
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
