<template>
  <TransitionSlide :disabled="!animation">
    <KeepAlive v-if="keepAlive">
      <Component :is="comp" v-bind="compProps" />
    </KeepAlive>
    <Component v-else :is="comp" v-bind="compProps" />
  </TransitionSlide>
</template>

<script lang="ts">
import { TransitionSlide } from '@/antdvx';
import { useRoute, useRouter } from 'vue-router';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';
import { PropType, defineComponent, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

export default defineComponent({
  name: 'component-view',
  components: {
    TransitionSlide
  },
  props: {
    animation: {
      type: Boolean,
      default: true
    },
    keepAlive: {
      type: Boolean,
      default: false
    },
    activeKey: [Number, String] as PropType<number | string>,
    routeParamKey: String,
    comps: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    }
  },
  emits: ['update:active-key'],
  setup(props: any, { emit }) {
    const route = useRoute();
    const router = useRouter();

    let comp = shallowRef();

    let compProps = ref();

    let keepAlive = ref(false);

    const activeKey_ = ref<string>((route.params[props.routeParamKey] as string) ? route.params[props.routeParamKey] : props.comps?.[0]?.name);

    const toggle = (key: number | string) => {
      if (!isNullOrUndefined(key)) {
        let c = props.comps?.find((x) => x.name === key);
        if (!c) {
          c = props.comps?.[0];
        }
        comp.value = c.comp;
        compProps.value = c.props;
        activeKey_.value = c.name;
        // 更新 route 参数
        router.replace({
          name: route.name,
          params: Object.assign({}, route.params, props.routeParamKey ? { [props.routeParamKey]: activeKey_.value } : null)
        });
      }
      if (props.activeKey !== key) {
        emit('update:active-key', key);
      }
    };

    watch(
      () => props.activeKey,
      (val) => {
        if (!isNullOrUndefined(val)) {
          if (activeKey_.value !== val) {
            activeKey_.value = val;
          }
        }
      },
      {
        immediate: true
      }
    );

    watch(activeKey_, (val) => {
      toggle(val);
    });

    onMounted(() => {
      toggle(activeKey_.value);
    });

    onUnmounted(() => {
      // 更新 route 参数
      route.params[props.routeParamKey] = null;
    });

    return {
      comp,
      compProps,
      keepAlive
    };
  }
});
</script>
