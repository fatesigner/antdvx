import { Input } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';

export const Tab1 = defineComponent({
  name: 'Tab1',
  props: {
    id: Number,
    text: String
  },
  setup(props) {
    const input = ref();

    watch(
      () => props.text,
      (val) => {
        console.log(val);
      }
    );

    return {
      input
    };
  },
  render(ctx) {
    return (
      <div class='tw-p-4'>
        <div class='tw-text-lg'>tab 1</div>
        <div class='tw-mt-2'>
          <div>id: {ctx.id}</div>
          <div>text: {ctx.text}</div>
          <Input class='tw-w-32' v-model={[ctx.input, 'value']} />
          {Array.from(new Array(5)).map(() => (
            <div class='tw-flex tw-items-center tw-space-x-2'>
              {Array.from(new Array(30)).map((x, i) => (
                <div>{i}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
});
