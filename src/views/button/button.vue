<template>
  <ScrollView>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">基础</div>
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
        <div class="tw-p-2 tw-border tw-border-gray-300" v-for="type in types">
          <div class="tw-text-lg tw-p-2">{{ type.text }} button</div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2" v-for="color in colors">
              <AntdButton :color="color.value" :type="type.value">{{ color.text }}</AntdButton>
            </div>
            <div class="tw-p-2">
              <AntdButton loading :type="type.value">loading</AntdButton>
            </div>
            <div class="tw-p-2">
              <AntdButton disabled :type="type.value">disabled</AntdButton>
            </div>
          </div>
          <div class="tw-p-2">
            <AntdButton block :type="type.value">block</AntdButton>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2" v-for="size in sizes">
              <AntdButton :size="size.value" :type="type.value">{{ size.text }}</AntdButton>
            </div>
            <div class="tw-p-2">
              <AntdButton pure :type="type.value">pure</AntdButton>
            </div>
          </div>
          <div class="tw-p-2">
            <ADropdown>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">1st item</AMenuItem>
                  <AMenuItem key="2">2nd item</AMenuItem>
                  <AMenuItem key="3">3rd item</AMenuItem>
                </AMenu>
              </template>
              <AntdButton :type="type.value">
                Actions
                <DownOutlined />
              </AntdButton>
            </ADropdown>
          </div>
        </div>
        <div class="tw-p-2 tw-border tw-border-gray-300">
          <div class="tw-text-lg tw-p-2">outline button</div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2" v-for="color in colors">
              <AntdButton :color="color.value" outline>{{ color.text }}</AntdButton>
            </div>
            <div class="tw-p-2">
              <AntdButton loading outline>loading</AntdButton>
            </div>
            <div class="tw-p-2">
              <AntdButton disabled outline>disabled</AntdButton>
            </div>
          </div>
          <div class="tw-p-2">
            <AntdButton color="primary" block outline>block</AntdButton>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2" v-for="size in sizes">
              <AntdButton :size="size.value">{{ size.text }}</AntdButton>
            </div>
          </div>
          <div class="tw-p-2">
            <ADropdown>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">1st item</AMenuItem>
                  <AMenuItem key="2">2nd item</AMenuItem>
                  <AMenuItem key="3">3rd item</AMenuItem>
                </AMenu>
              </template>
              <AntdButton outline>
                Actions
                <DownOutlined />
              </AntdButton>
            </ADropdown>
          </div>
        </div>
      </div>

      <div class="tw-text-lg">功能性</div>
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
        <div class="tw-p-2 tw-border tw-border-gray-300">
          <div class="tw-text-lg tw-p-2">Action Button</div>
          <div class="tw-p-2 tw-text-gray-600 tw-text-xs">
            用于需要异步操作的按钮，提供一个异步函数 handler，函数执行阶段，将自动添加 loading，结束后，若该函数抛出异常，则自动显示 notification。
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2" v-for="type in types">
              <ActionButton outline notify :type="type.value" :handler="load(3000, true)">加载</ActionButton>
            </div>
            <div class="tw-p-2">
              <ActionButton outline pure notify :handler="load(3000, true)">加载</ActionButton>
            </div>
          </div>
          <div class="tw-p-2 tw-text-gray-600 tw-text-xs">基于 ActionButton 封装的常用的一些操作。</div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <ActionAdd outline notify :handler="load(3000, true)">添加</ActionAdd>
            </div>
            <div class="tw-p-2">
              <ActionEdit outline notify :handler="load(3000, true)">编辑</ActionEdit>
            </div>
            <div class="tw-p-2">
              <ActionDelete confirmed outline notify :handler="load(3000, true)">删除</ActionDelete>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { timer } from 'rxjs';
import { defineComponent } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { AntdButton } from 'antdvx/components/button';
import { ScrollView } from 'antdvx/components/scroll-view';
import { ActionAdd, ActionButton, ActionDelete, ActionEdit, ActionRefresh } from 'antdvx/components/action-bars';

import { BUTTON_TYPES, COLORS, SIZES } from '@/app/constants';

export default defineComponent({
  components: {
    ScrollView,
    AntdButton,
    ActionAdd,
    ActionEdit,
    ActionDelete,
    ActionRefresh,
    ActionButton,
    // Antd
    DownOutlined,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Dropdown.name]: Dropdown
  },
  setup() {
    const load = (duration?: number, error?: boolean) => {
      return async () => {
        return timer(duration ?? 2000)
          .toPromise()
          .then(() => {
            if (error) {
              throw new Error('Load failed, please try again.');
            }
          });
      };
    };

    return { sizes: SIZES.arr, colors: COLORS.arr, types: BUTTON_TYPES.arr, load };
  }
});
</script>
