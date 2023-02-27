import { defineComponent, ref } from 'vue';
import { Table } from 'ant-design-vue';

/**
 * Antdvx Table（对原 Antdv Table 组件的二次封装）
 */
export const XTable = defineComponent({
  setup(props, ctx) {
    // 列
    const columns_ = ref([]);

    return {
      columns_
    };
  },
  render(ctx) {
    return <Table columns={ctx.columns_}></Table>;
  }
});
