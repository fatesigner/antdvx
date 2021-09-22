<template>
  <ADropdown :disabled="disabled || loading" :placement="placement">
    <XButton
      :block="block"
      :disabled="disabled"
      :ghost="ghost"
      :href="href"
      :htmlType="htmlType"
      :loading="loading_"
      :shape="shape"
      :size="size"
      :target="target"
      :type="type"
      :color="color"
      :spin="false"
      :title="title ? title : $t(i18nMessages.antd.action.export)"
    >
      <IconLoader5Line :spin="loading_" v-if="loading_" />
      <IconFileDownloadLine :spin="loading_" v-else />
      <template v-if="!onlyIcon">
        {{ $t(i18nMessages.antd.action.export) }}
      </template>
    </XButton>
    <template #overlay>
      <AMenu @click="onActionClick">
        <AMenuItem v-if="jsonVisible" key="json">{{ $t(i18nMessages.antd.action.exportToJSON) }}</AMenuItem>
        <AMenuItem v-if="pdfVisible" key="pdf">{{ $t(i18nMessages.antd.action.exportToPDF) }}</AMenuItem>
        <AMenuItem v-if="imageVisible" key="image">{{ $t(i18nMessages.antd.action.exportToImage) }}</AMenuItem>
        <AMenuItem v-if="excelVisible" key="excel">{{ $t(i18nMessages.antd.action.exportToExcel) }}</AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<script lang="ts">
import to from 'await-to-js';
import { timer } from 'rxjs';
import { isFunction } from '@fatesigner/utils/type-check';
import { Dropdown, Menu, notification } from 'ant-design-vue';
import { convertHtmlToCanvas } from '@fatesigner/utils/html-canvas';
import { PropType, computed, defineComponent, reactive, ref } from 'vue';

import { i18nMessages } from '../../i18n/messages';
import { IconFileDownloadLine, IconLoader5Line } from '../iconfont';

import { XButton } from './button';
import { IXButtonExportOptions, XButtonProps } from './types';

export default defineComponent({
  name: 'x-button-export',
  components: {
    XButton,
    IconLoader5Line,
    IconFileDownloadLine,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Dropdown.name]: Dropdown
  },
  props: {
    ...XButtonProps,
    onlyIcon: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottomLeft'
    },
    options: {
      type: [Object, Function] as PropType<IXButtonExportOptions>
    }
  },
  setup(props: any) {
    const loading_ = ref(false);
    const options_ = reactive<IXButtonExportOptions>({
      image: null,
      excel: null,
      pdf: null
    });

    const jsonVisible = computed(() => {
      return !!props?.options?.json;
    });

    const pdfVisible = computed(() => {
      return !!props?.options?.pdf;
    });

    const imageVisible = computed(() => {
      return !!props?.options?.image;
    });

    const excelVisible = computed(() => {
      return !!props?.options?.excel;
    });

    const download = async (workbook, filename?) => {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = objectUrl;
      a.download = `${props?.options?.filename || filename || new Date().getTime()}.xlsx`;
      a.click();
      document.body.removeChild(a);
    };

    const loadOptions = async (loadFunc, opt) => {
      if (isFunction(loadFunc)) {
        const [err, res] = await to((loadFunc as any)());
        if (err) {
          if (props.notify) {
            notification.error({ message: '', description: err.message });
          } else {
            throw err;
          }
        } else {
          return Object.assign({}, opt, res);
        }
      } else {
        return Object.assign({}, opt, loadFunc);
      }
    };

    const onActionClick = async (e) => {
      loading_.value = true;

      await timer(300).toPromise();

      if (e.key === 'json') {
        options_.json = await loadOptions(props?.options?.json, options_.json);
        let opt = options_?.json as any;
        if (opt?.content) {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([opt.content]), opt.filename);
          } else {
            const url = window.URL.createObjectURL(new Blob([opt.content], { type: 'data:application/json;charset=utf-8' }));
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', `${opt.filename || new Date().getTime()}.json`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        } else {
          throw new Error('The json content can not be empty.');
        }
      } else if (e.key === 'excel') {
        options_.excel = await loadOptions(props?.options?.excel, options_.excel);
        let opt = options_?.excel as any;
        if (opt) {
          const _excel: any = await import('exceljs');
          const ExcelJS = _excel.default;

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet();

          const { filename, data, columns } = opt;

          if (filename) {
            worksheet.name = filename;
          }

          if (data.length) {
            if (columns) {
              worksheet.columns = columns.map((item) => ({
                header: item.header,
                key: item.key
              }));
              data.forEach((item, index) => {
                const newItem = columns.reduce((prev, cur) => {
                  if (cur.template) {
                    prev[cur.key] = cur.template(item, index);
                  } else {
                    prev[cur.key] = item[cur.key];
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
      } else if (e.key === 'pdf') {
        options_.pdf = await loadOptions(props?.options?.pdf, options_.pdf);
        let opt = options_?.pdf as any;
        if (opt?.target) {
          // TODO
          // const jsPDF: any = await import('jspdf');
          // const doc = new jsPDF();
          await convertHtmlToCanvas(opt.target).then((image) => {});
        }
      } else if (e.key === 'image') {
        options_.image = await loadOptions(props?.options?.image, options_.image);
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

        let opt = options_?.image as any;

        if (opt?.target) {
          await convertHtmlToCanvas(opt.target, {
            allowTaint: true,
            width: opt.target.offsetWidth,
            height: opt.target.offsetHeight,
            scrollX: opt.target.scrollLeft,
            scrollY: opt.target.scrollTop,
            ignoreElements: (e: any) => {
              if (e.tagName.toLowerCase() === 'iframe') {
                return e;
              }
              return false;
            }
          }).then((canvas) => {
            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const a = document.createElement('a');
            a.setAttribute('download', `${opt.filename || new Date().getTime()}.png`);
            a.setAttribute('href', image);
            a.click();
          });
        }
      }

      loading_.value = false;
    };

    return {
      i18nMessages,
      loading_,
      options_,
      jsonVisible,
      pdfVisible,
      imageVisible,
      excelVisible,
      onActionClick,
      download
    };
  }
});
</script>
