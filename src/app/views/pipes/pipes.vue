<template>
  <PageWrapper title="Pipes">
    <div class="tw-p-2">
      <div class="tw-p-4 tw-space-y-4 tw-bg-white">
        <div class="tw-text-lg">管道过滤器（pipes）</div>
        <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
          <div class="tw-p-4 tw-border tw-border-gray-300 tw-space-y-4">
            <div class="tw-text-lg">currencyFormat（货币格式化）</div>

            <div class="tw-flex tw-items-center tw-space-x-2">
              <div class="tw-flex-initial">输入数值：</div>
              <div class="tw-flex-1">
                <AInputNumber class="tw-w-40" :step="Math.pow(0.1, fixedDigits + 1).toFixed(fixedDigits + 1)" v-model:value="numValue" placeholder="输入数值" />
              </div>
              <div class="tw-flex-initial">fixed digits：</div>
              <div class="tw-flex-1">
                <AInputNumber class="tw-w-14" step="1" :min="0" v-model:value="fixedDigits" placeholder="输入fixed" />
              </div>
              <div class="tw-flex-initial">currency digits：</div>
              <div class="tw-flex-1">
                <AInputNumber class="tw-w-14" step="1" :min="0" v-model:value="currencyDigits" placeholder="输入fixed" />
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">default</div>
              <div class="tw-text-gray-700">
                {{ numValue.toFixed(fixedDigits) }}&nbsp;&nbsp;&nbsp;{{ $pipes.currencyFormat(numValue, null, { digits: fixedDigits }) }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">normal（银行家舍入法，“四舍六入五成双"）</div>
              <div class="tw-text-gray-700">
                {{
                  $pipes.currencyFormat(
                    numValue,
                    new Intl.NumberFormat('zh-CN', {
                      currency: 'CNY',
                      minimumFractionDigits: currencyDigits
                    })
                  )
                }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">round（标准的四舍五入）</div>
              <div class="tw-text-gray-700">
                {{
                  $pipes.currencyFormat(
                    numValue,
                    new Intl.NumberFormat('zh-CN', {
                      currency: 'CNY',
                      minimumFractionDigits: currencyDigits,
                      maximumFractionDigits: currencyDigits
                    }),
                    { digits: fixedDigits, mode: 'round' }
                  )
                }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">increase（无论数值大小, 一律进 1）</div>
              <div class="tw-text-gray-700">
                {{
                  $pipes.currencyFormat(
                    numValue,
                    new Intl.NumberFormat('zh-CN', {
                      currency: 'CNY',
                      minimumFractionDigits: currencyDigits,
                      maximumFractionDigits: currencyDigits
                    }),
                    { digits: fixedDigits, mode: 'increase' }
                  )
                }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">ignore（无论数值大小, 一律舍弃）</div>
              <div class="tw-text-gray-700">
                {{
                  $pipes.currencyFormat(
                    numValue,
                    new Intl.NumberFormat('zh-CN', {
                      currency: 'CNY',
                      minimumFractionDigits: currencyDigits,
                      maximumFractionDigits: currencyDigits
                    }),
                    { digits: fixedDigits, mode: 'ignore' }
                  )
                }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">thousandsFormat（千分位格式化）</div>
              <div class="tw-text-gray-700">
                {{ $pipes.thousandsFormat(numValue, { digits: currencyDigits, mode: 'ignore' }) }}
              </div>
            </div>
          </div>

          <div class="tw-p-4 tw-border tw-border-gray-300 tw-space-y-4">
            <div class="tw-text-lg">dateFormat（日期格式化）</div>
            <div class="tw-flex tw-items-center tw-space-x-2">
              <div class="tw-flex-initial">选择时间：</div>
              <div class="tw-flex-1">
                <ADatePicker show-time v-model:value="dateValue" placeholder="选择时间" />
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">default</div>
              <div class="tw-text-gray-700">
                {{ $pipes.dateFormat(dateValue) }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">YYYY-MM-DD</div>
              <div class="tw-text-gray-700">
                {{ $pipes.dateFormat(dateValue, 'YYYY-MM-DD') }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">YYYY-MM-DD HH:mm:ss</div>
              <div class="tw-text-gray-700">
                {{ $pipes.dateFormat(dateValue, 'YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">M/D/YYYY</div>
              <div class="tw-text-gray-700">
                {{ $pipes.dateFormat(dateValue, 'M/D/YYYY') }}
              </div>
            </div>

            <div class="tw-space-y-2">
              <div class="tw-text-gray-500">ddd, MMM D, YYYY h:mm A</div>
              <div class="tw-text-gray-700">
                {{ $pipes.dateFormat(dateValue, 'MMMM D, YYYY h:mm A') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import { defineComponent, ref } from 'vue';
import { focus } from '@/antdvx/directives';
import { ScrollView, XButton } from '@/antdvx';
import { DatePicker, Input, InputNumber, InputSearch } from 'ant-design-vue';

import { PageWrapper } from '@/app/shared/page-wrapper';

export default defineComponent({
  components: {
    XButton,
    ScrollView,
    PageWrapper,
    [Input.name]: Input,
    [InputNumber.name]: InputNumber,
    [InputSearch.name]: InputSearch,
    [DatePicker.name]: DatePicker
  },
  directives: {
    focus
  },
  setup() {
    const fixedDigits = ref(4);
    const currencyDigits = ref(4);
    const numValue = ref(1234567.8912);
    const dateValue = ref(dayjs(new Date()));

    return {
      fixedDigits,
      currencyDigits,
      numValue,
      dateValue
    };
  }
});
</script>
