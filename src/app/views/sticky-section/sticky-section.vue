<template>
  <ScrollView fill-y scroll-y native>
    <StickySection class="tw-sticky tw-top-0 tw-bottom-0 tw-z-10" :class-name="['tw-cursor-pointer']" title="Click to show Package" shadow-top shadow-bottom>
      <template #default="{ sticky }">
        <div class="tw-flex tw-items-center tw-space-x-2 tw-bg-white tw-p-4">
          <h2 class="tw-m-0">Package</h2>
          <IconArrowDownSLine scale="1.5" v-show="sticky" />
        </div>
      </template>
    </StickySection>

    <div class="tw-p-4">
      <div v-for="item in 100">{{ item }}</div>
    </div>

    <StickySection
      class="tw-sticky tw-top-0 tw-bottom-0 tw-z-10"
      :class-name="['tw-cursor-pointer']"
      title="Click to show Cost To Complete"
      shadow-top
      shadow-bottom
    >
      <template #default="{ sticky }">
        <div class="tw-flex tw-items-center tw-space-x-2 tw-bg-white tw-p-4">
          <h2 class="tw-m-0">Cost To Complete</h2>
          <IconArrowDownSLine scale="1.5" v-show="sticky" />
        </div>
      </template>
    </StickySection>

    <div class="tw-p-4">
      <div v-for="item in 100">{{ item }}</div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconArrowDownSLine, ScrollView, StickySection } from '@/antdvx';

export default defineComponent({
  components: {
    ScrollView,
    StickySection,
    IconArrowDownSLine
  },
  setup() {
    return {};
  }
});
</script>
