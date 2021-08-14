<template>
  <ScrollView>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">基础</div>
      <div class="tw-grid md:tw-grid-cols-2 tw-gap-4">
        <div class="tw-p-2 tw-border tw-border-gray-300" v-for="type in types">
          <div class="tw-text-lg tw-p-2">{{ type }} button</div>
          <div class="tw-text-sm tw-p-2">Colors</div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButton :type="type">normal</XButton>
            </div>
            <div class="tw-p-2" v-for="color in colors">
              <XButton :color="color" :type="type">{{ color }}</XButton>
            </div>
            <div class="tw-p-2">
              <XButton loading :type="type">loading</XButton>
            </div>
            <div class="tw-p-2">
              <XButton disabled :type="type">disabled</XButton>
            </div>
          </div>
          <div class="tw-p-2">
            <XButton block :type="type">block</XButton>
          </div>
          <div class="tw-text-sm tw-p-2">Sizes</div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2" v-for="size in sizes">
              <XButton :size="size" :type="type">{{ size }}</XButton>
            </div>
          </div>
          <div class="tw-text-sm tw-p-2">Dropdown</div>
          <div class="tw-p-2">
            <ADropdown>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">1st item</AMenuItem>
                  <AMenuItem key="2">2nd item</AMenuItem>
                  <AMenuItem key="3">3rd item</AMenuItem>
                </AMenu>
              </template>
              <XButton :type="type">
                Actions
                <DownOutlined />
              </XButton>
            </ADropdown>
          </div>
        </div>
        <div class="tw-p-2 tw-border tw-border-gray-300">
          <div class="tw-text-lg tw-p-2">功能性</div>
          <div class="tw-p-2 tw-text-gray-600 tw-text-xs">
            用于需要异步操作的按钮，提供一个异步函数 handler，函数执行阶段，将自动添加 loading，结束后，若该函数抛出异常，则自动显示 notification。
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2" v-for="type in types">
              <XButton outline notify :type="type" :handler="load(3000, true)">加载</XButton>
            </div>
            <div class="tw-p-2">
              <XButton outline pure notify :handler="load(3000, true)">加载</XButton>
            </div>
          </div>
          <div class="tw-p-2 tw-text-gray-600 tw-text-xs">基于 Button 封装的常用的一些操作按钮。</div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButtonAdd type="outline" notify :handler="load(3000, true)">添加</XButtonAdd>
            </div>
            <div class="tw-p-2">
              <XButtonEdit type="outline" notify :handler="load(3000, true)">编辑</XButtonEdit>
            </div>
            <div class="tw-p-2">
              <XButtonDelete confirmed notify type="outline" :handler="load(3000, true)">删除</XButtonDelete>
            </div>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButtonAdd type="outline" notify :handler="load(3000, true)">添加</XButtonAdd>
            </div>
            <div class="tw-p-2">
              <XButtonEdit type="outline" notify :handler="load(3000, true)">编辑</XButtonEdit>
            </div>
            <div class="tw-p-2">
              <XButtonDelete confirmed notify type="outline" :handler="load(3000, true)"></XButtonDelete>
            </div>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButtonAdd color="success" mode="icon" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonEdit color="primary" mode="icon" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonDelete confirmed notify color="danger" mode="icon" size="mini" type="link" :handler="load(3000, true)" />
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
import { ANTDVX_BUTTON_TYPES, ANTDVX_COLORS, ANTDVX_SIZES, ScrollView, XButton, XButtonAdd, XButtonDelete, XButtonEdit, XButtonRefresh } from 'antdvx';

export default defineComponent({
  components: {
    XButton,
    XButtonAdd,
    XButtonEdit,
    XButtonDelete,
    XButtonRefresh,
    ScrollView,
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

    return { sizes: ANTDVX_SIZES, colors: ANTDVX_COLORS, types: ANTDVX_BUTTON_TYPES, load };
  }
});
</script>
