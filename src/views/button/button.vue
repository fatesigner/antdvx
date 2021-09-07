<template>
  <ScrollView>
    <div class="tw-p-4 tw-space-y-4">
      <div class="tw-text-lg">基础</div>
      <div class="tw-grid lg:tw-grid-cols-2 tw-gap-4">
        <div class="tw-p-2 tw-border tw-border-gray-300" v-for="type in types">
          <div class="tw-text-lg tw-p-2">{{ type }} button</div>
          <div class="tw-text-sm tw-p-2">Colors</div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButton color="default" :type="type">normal</XButton>
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
            <div class="tw-p-2">
              <XButton disabled color="primary" :type="type">disabled</XButton>
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
                <IconArrowDownSLine />
              </XButton>
            </ADropdown>
          </div>
        </div>
        <div class="tw-p-2 tw-border tw-border-gray-300">
          <div class="tw-text-lg tw-p-2">功能性</div>
          <div class="tw-p-2 tw-text-gray-600 tw-text-sm">基于 Button 封装的常用的一些操作按钮。</div>
          <div class="tw-p-2 tw-text-gray-500 tw-text-xxs">
            用于需要异步操作的按钮，提供一个异步函数 handler，函数执行阶段，将自动添加 loading，结束后，若该函数抛出异常，则自动显示 notification。
          </div>
          <div class="tw-flex tw-flex-wrap tw-p-2 tw-border tw-border-gray-300">
            <div class="tw-p-2" v-for="type in types">
              <XButtonUpload :type="type" :handler="upload(3000)" />
            </div>
          </div>
          <div class="tw-flex tw-flex-wrap tw-p-2 tw-border tw-border-gray-300">
            <div class="tw-p-2" v-for="type in types">
              <XButtonExport :type="type" :options="exportOptions" />
            </div>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButtonAdd notify type="outline" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonEdit notify type="outline" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonSave notify type="outline" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonDelete confirmed notify type="outline" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonRefresh notify type="outline" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonUpload notify type="outline" :handler="upload(3000)" />
            </div>
            <div class="tw-p-2">
              <XButtonUpload autosize :show-icon="false" type="outline" :handler="upload(3000)">
                <div>AAA</div>
                <div>zzz</div>
              </XButtonUpload>
            </div>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButtonAdd only-icon type="text" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonEdit only-icon type="text" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonSave only-icon type="text" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonDelete confirmed only-icon type="text" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonRefresh only-icon type="text" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonUpload only-icon type="text" :handler="upload(3000, true)" />
            </div>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButtonAdd color="success" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonEdit color="primary" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonSave color="secondary" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonDelete confirmed color="danger" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonRefresh color="primary" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonUpload color="secondary" size="mini" type="link" :handler="upload(3000, true)" />
            </div>
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div class="tw-p-2">
              <XButtonAdd only-icon color="success" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonEdit only-icon color="primary" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonSave only-icon color="secondary" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonDelete confirmed only-icon color="danger" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonRefresh only-icon color="primary" size="mini" type="link" :handler="load(3000, true)" />
            </div>
            <div class="tw-p-2">
              <XButtonUpload only-icon color="secondary" size="mini" type="link" :handler="upload(3000, true)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="tsx">
import { timer } from 'rxjs';
import { defineComponent } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import {
  ANTDVX_BUTTON_TYPES,
  ANTDVX_COLORS,
  ANTDVX_SIZES,
  IXButtonExportOptions,
  IconArrowDownSLine,
  ScrollView,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonExport,
  XButtonRefresh,
  XButtonSave,
  XButtonUpload,
  createXModal
} from '@/antdvx';

import { getBase64FromFile } from '@/utils';

export default defineComponent({
  components: {
    XButton,
    XButtonAdd,
    XButtonEdit,
    XButtonSave,
    XButtonDelete,
    XButtonRefresh,
    XButtonExport,
    XButtonUpload,
    IconArrowDownSLine,
    ScrollView,
    // Antd
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Dropdown.name]: Dropdown
  },
  setup() {
    const exportOptions: IXButtonExportOptions = {
      json: {
        filename: 'zadsad',
        content: JSON.stringify({ a: '1', b: '2' })
      },
      image: {
        filename: 'dasdas',
        target: document.body
      },
      excel: {
        filename: 'excel',
        data: [
          {
            title: 'title 1',
            desc: 'desc 1'
          },
          {
            title: 'title 2',
            desc: 'desc 2'
          }
        ],
        columns: [
          {
            header: '标题',
            key: 'title'
          },
          {
            header: '描述',
            key: 'desc'
          }
        ]
      }
    };

    // 加载数据
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

    // 上传
    const upload = (duration?: number, error?: boolean) => {
      return async (file) => {
        return timer(duration ?? 2000)
          .toPromise()
          .then(() => {
            if (error) {
              throw new Error('Load failed, please try again.');
            } else {
              // 获取图片预览地址
              getBase64FromFile(file).then((base64) => {
                createXModal(
                  defineComponent({
                    render() {
                      return <img src={base64} title='' alt='' />;
                    }
                  }),
                  null,
                  {
                    autoOpened: true,
                    destroyOnClose: true
                  }
                );
              });
            }
          });
      };
    };

    return { exportOptions, sizes: ANTDVX_SIZES, colors: ANTDVX_COLORS, types: ANTDVX_BUTTON_TYPES, load, upload };
  }
});
</script>
