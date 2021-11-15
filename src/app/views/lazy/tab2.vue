<template>
  <div class="tw-p-4">
    <div class="tw-text-lg">tab 2</div>
    <div class="tw-mt-2">
      <div>id: {{ id }}</div>
      <div>text: {{ text }}</div>
      <AInput class="tw-w-32" v-model:value="input" />
      <div class="tw-flex tw-items-center tw-space-x-2" v-for="item in 10">
        <div v-for="item in 30">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Input } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    [Input.name]: Input
  },
  props: {
    id: Number,
    text: String
  },
  setup(props) {
    const input = ref();

    watch(
      () => props.text,
      (val) => {
        console.log(val);
      }
    );

    return { input };
  }
});
</script>
