import { Spin, notification } from 'ant-design-vue';
import { PropType, defineComponent, ref, watch } from 'vue';

import { ANTDVX_SIZES } from '../../constants';

export const XButtonSpin = defineComponent({
  name: 'x-button-spin',
  props: {
    size: {
      type: String as PropType<typeof ANTDVX_SIZES[number]>,
      default: 'default'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handler: {
      type: [Object, Promise, Function],
      default: null
    }
  },
  emits: ['click'],
  setup(props: any, { emit }) {
    const loading_ = ref(false);

    watch(
      () => props.loading,
      (val) => {
        if (loading_.value !== val) {
          loading_.value = val;
        }
      },
      {
        immediate: true
      }
    );

    const trigger = (e) => {
      if (props.handler) {
        loading_.value = true;
        props
          .handler()
          .catch((err) => {
            if (props.notify) {
              notification.error({ message: '', description: err.message });
            } else {
              throw err;
            }
          })
          .finally(() => {
            loading_.value = false;
          });
      } else {
        emit('click', e);
      }
    };

    return { loading_, trigger };
  },
  render(ctx) {
    return (
      <div class={['ant-btn-spin', ctx.disabled ? 'ant-btn-spin-disabled' : undefined]} onClick={!ctx.disabled && ctx.trigger}>
        {[
          ctx.loading_ ? (
            <div class='ant-btn-spin-loading'>
              <Spin size={ctx.size} />
            </div>
          ) : (
            ''
          ),
          ctx.$slots?.default ? ctx.$slots?.default() : ''
        ]}
      </div>
    );
  }
});
