<template>
  <a-dropdown :disabled="disabled || loading" :placement="placement">
    <a-button
      :block="block"
      :disabled="disabled || loading"
      :ghost="ghost"
      :html-type="htmlType"
      :loading="loading"
      :type="type"
      :size="size"
      :color="color"
      :outline="outline"
      :title="title ? title : $t(i18nMessages.antd.action.export)"
    >
      <template v-if="loading">{{ $t(i18nMessages.antd.action.exporting) }}... </template>
      <template v-else><icon-external-link scale="0.9" />{{ $t(i18nMessages.antd.action.export) }}</template>
    </a-button>
    <template #overlay>
      <AMenu @click="onActionClick">
        <AMenuItem v-if="pdf" key="pdf">{{ $t(i18nMessages.antd.action.exportToPDF) }}</AMenuItem>
        <AMenuItem v-if="target" key="image">{{ $t(i18nMessages.antd.action.exportToImage) }}</AMenuItem>
        <AMenuItem v-if="resource" key="excel">{{ $t(i18nMessages.antd.action.exportToExcel) }}</AMenuItem>
      </AMenu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import to from 'await-to-js';
import { timer } from 'rxjs';
import { defineComponent, ref } from 'vue';
import { Button, Dropdown, Menu, message } from 'ant-design-vue';
import { isFunction } from '@fatesigner/utils/type-check';
import { convertHtmlToCanvas } from '@fatesigner/utils/html-canvas';
import buttonProps from 'ant-design-vue/lib/button/buttonTypes';

import { IconExternalLink } from '../iconfont';
import { i18nMessages } from '../../i18n/messages';

const buttonProps_ = buttonProps();

export default defineComponent({
  components: {
    [Button.name]: Button,
    [Dropdown.name]: Dropdown,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    IconExternalLink
  },
  props: {
    ...buttonProps_,
    color: {
      type: String,
      default: null
    },
    outline: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: null
    },
    placement: {
      type: String,
      default: 'bottomLeft'
    },
    filename: String,
    target: [Object, Function] as any,
    resource: [Object, Function] as any,
    pdf: Object as any
  },
  setup(props) {
    const loading = ref(false);

    const download = async (workbook, filename?) => {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = objectUrl;
      a.download = `${props.filename || filename || new Date().getTime()}.xlsx`;
      a.click();
      document.body.removeChild(a);
    };

    const onActionClick = async (e) => {
      loading.value = true;
      await timer(300).toPromise();
      if (e.key === 'pdf') {
        let target;
        if (isFunction(props.target)) {
          target = props.target();
        }
        await convertHtmlToCanvas(target).then((image) => {});
      } else if (e.key === 'image') {
        let target;
        if (isFunction(props.target)) {
          target = props.target();
        }

        /* const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet();

        const canvas = await convertHtmlToCanvas(target);

        const image = canvas.toDataURL('image/png');

        const imageId = workbook.addImage({
          base64: image,
          extension: 'png'
        });

        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: canvas.width, height: canvas.height }
        });

        await download(workbook); */

        const { top, left } = target.getBoundingClientRect();

        await convertHtmlToCanvas(target, {
          allowTaint: true,
          width: target.offsetWidth,
          height: target.offsetHeight,
          scrollX: target.scrollLeft,
          scrollY: target.scrollTop,
          x: left + window.scrollX,
          y: top + window.scrollY,
          ignoreElements: (element: any) => {
            if (element.tagName.toLowerCase() === 'iframe') {
              return element;
            }
            return false;
          }
        }).then((canvas) => {
          // document.body.appendChild(canvas);
          const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
          const a = document.createElement('a');
          a.setAttribute('download', `${props.filename || new Date().getTime()}.png`);
          a.setAttribute('href', image);
          a.click();
        });
      } else if (e.key === 'excel') {
        if (props.resource) {
          const _excel: any = await import('exceljs');
          const ExcelJS = _excel.default;

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet();

          const [err, { filename, data, columns }] = await to(props.resource());

          if (err) {
            return message.error(err.message);
          }

          if (filename) {
            worksheet.name = filename;
          }

          if (data.length) {
            if (columns) {
              worksheet.columns = columns.map((item) => ({
                header: item.label,
                key: item.name
              }));
              data.forEach((item, index) => {
                const newItem = columns.reduce((prev, cur) => {
                  if (cur.template) {
                    prev[cur.name] = cur.template(item, index);
                  } else {
                    prev[cur.name] = item[cur.name];
                  }
                  return prev;
                }, {});
                worksheet.addRow(newItem);
              });
            } else {
              worksheet.columns = Object.keys(data[0]).map((key) => ({
                header: key,
                key: key
              }));
              data.forEach((item) => {
                worksheet.addRow(item);
              });
            }
          }

          worksheet.getRow(1).font = { bold: true };

          if (worksheet.columns) {
            worksheet.columns.forEach((column) => {
              if (column.header) {
                column.width = column.header.length < 12 ? 12 : column.header.length;
              }
            });
          }

          await download(workbook, filename);
        }
      }

      loading.value = false;
    };

    return {
      i18nMessages,
      loading,
      onActionClick,
      download
    };
  }
});
</script>
