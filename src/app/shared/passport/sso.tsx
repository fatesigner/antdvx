import { defineComponent, onMounted, ref } from 'vue';
import { getParamsFromUrl } from '@fatesigner/utils';
import { Spin } from 'ant-design-vue';

/**
 * SSO 授权入口
 */
export default defineComponent({
  emits: ['completed'],
  setup(props, { emit }) {
    const loading = ref(true);

    onMounted(() => {
      const url = window.location.search ? window.location.search : window.location.hash;
      const params = getParamsFromUrl(url);
      emit('completed', {
        url,
        params
      });
      loading.value = false;
    });

    return {
      loading
    };
  },
  render(ctx) {
    return (
      <div class='tw-fixed tw-left-1/2 tw-top-1/2 tw--translate-x-1/2 tw--translate-y-1/2 tw-transform'>
        {ctx.loading ? <Spin size='large' /> : undefined}
      </div>
    );
  }
});
