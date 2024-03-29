import { PropType } from 'vue';

import { ANTDVX_COLORS } from '../../constants';

/**
 * Iconfont props
 */
export const IconfontProps = {
  name: {
    type: String
  },
  title: {
    type: String
  },
  color: {
    type: String as PropType<typeof ANTDVX_COLORS[number]>
  },
  colors: {
    type: Array,
    default() {
      return [];
    }
  },
  scale: {
    type: [Number, String]
  },
  spin: {
    type: Boolean,
    default: false
  },
  rotate: {
    type: [Number, String]
  }
};
