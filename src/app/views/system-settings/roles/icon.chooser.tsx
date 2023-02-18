import { Input } from 'ant-design-vue';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { ANTDVX_ICON_NAMES, Iconfont, XButton, XButtonSearch } from 'antdvx';

/**
 * 图标选择器
 */
export const IconChooser = defineComponent({
  emits: ['close'],
  setup(props) {
    const wrapRef = ref();

    const query = reactive({
      category: undefined,
      keywords: undefined
    });

    const icons = reactive([]);

    const filter = () => {
      let keywords = query.keywords?.trim()?.toLowerCase();
      keywords = keywords || undefined;
      icons.splice(0, icons.length, ...ANTDVX_ICON_NAMES.filter((x) => !keywords || x.toLowerCase().indexOf(keywords) > -1).slice(0, 100));
    };

    onMounted(() => {
      filter();
    });

    return {
      wrapRef,
      query,
      icons,
      filter
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-flex-col tw-h-full tw-h-96' ref='wrapRef'>
        <div class='tw-flex tw-items-center tw-gap-2 tw-p-2'>
          <Input
            class='tw-w-full'
            allowClear
            v-model={[ctx.query.keywords, 'value']}
            onChange={(e) => {
              if (!e.target.value) {
                ctx.filter();
              }
            }}
            onKeydown={(e) => {
              if (e.key === 'Enter') {
                ctx.filter();
              }
            }}
            placeholder='Input icon name...'
            v-slots={{
              suffix() {
                return (
                  <XButtonSearch
                    onlyIcon
                    size='mini'
                    type='link'
                    onClick={() => {
                      ctx.filter();
                    }}
                  />
                );
              }
            }}
          />
          <XButton
            color='cyan'
            type='primary'
            onClick={() => {
              ctx.filter();
            }}>
            Search
          </XButton>
        </div>
        <div class='tw-flex-1 tw-p-2 tw-overflow-y-auto'>
          <div class='tw-grid tw-grid-cols-12 tw-gap-2'>
            {ctx.icons.map((x) => (
              <div class='tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 tw-cursor-pointer'>
                <Iconfont name={x} />
                <div class='tw-text-sm tw-text-center'>{x}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
});
