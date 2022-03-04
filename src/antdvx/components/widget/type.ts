import { PropType } from 'vue';

/**
 * Widget props
 */
export const WidgetProps = {
  visible: {
    type: Boolean,
    default: true
  },
  title: {
    type: String
  },
  right: {
    type: [Number, String] as PropType<number | string>,
    default: 60
  },
  bottom: {
    type: [Number, String] as PropType<number | string>,
    default: 20
  },
  dragable: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: Number as PropType<number>,
    default: 10
  }
};
