import { Button } from 'ant-design-vue';
import { PropType, defineComponent } from 'vue';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';

export default defineComponent({
  props: {
    ...buttonProps,
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
  setup(props: any, { emit, slots }) {
    return () => {
      if (props.type === '3d') {
        return (
          <Button
            class={['ant-btn-3d', props.color ? `ant-color-${props.color}` : '']}
            block={props.block}
            disabled={props.disabled}
            ghost={props.ghost}
            htmlType={props.htmlType}
            loading={props.loading}
            type='default'
            size={props.size}
            title={props.title}
          >
            {slots.default?.()}
          </Button>
        );
      } else {
        return (
          <Button
            class={{ ['ant-color-' + props.color]: !!props.color, 'ant-btn-outline': props.outline, 'ant-btn-pure': props.pure }}
            block={props.block}
            disabled={props.disabled}
            ghost={props.ghost}
            htmlType={props.htmlType}
            loading={props.loading}
            type={props.type}
            size={props.size}
            title={props.title}
          >
            {slots.default?.()}
          </Button>
        );
      }
    };
  }
});
