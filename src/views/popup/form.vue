<template>
  <div class="tw-h-full">
    <ScrollView>
      <VeeForm>
        <div class="tw-p-4">
          表单 {{ id }}
          <XButton color="primary" @click="submit">提交</XButton>
          <div class="tw-border tw-border-gray-600" style="height: 2000px"></div>
        </div>
      </VeeForm>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ScrollView, XButton } from 'antdvx';

export default defineComponent({
  components: { XButton, ScrollView },
  emits: ['done'],
  props: {
    id: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const submit = () => {
      emit('done', true);
    };

    return { submit };
  }
});
</script>
