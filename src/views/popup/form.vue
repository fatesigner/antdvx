<template>
  <div class="tw-h-full">
    <ScrollView>
      <div class="tw-p-4">
        表单 {{ id }}
        <div class="tw-border tw-border-gray-600" style="height: 2000px"></div>
      </div>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ScrollView } from '@/antdvx/components/scroll-view';

export default defineComponent({
  components: { ScrollView },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  setup() {
    return {};
  }
});
</script>
