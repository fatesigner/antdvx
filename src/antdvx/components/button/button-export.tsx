import to from 'await-to-js';
import { timer } from 'rxjs';
import { isFunction } from '@fatesigner/utils/type-check';
import { convertHtmlToCanvas } from '@fatesigner/utils/html-canvas';
import { Dropdown, Menu, MenuItem, notification } from 'ant-design-vue';
import { PropType, computed, defineComponent, reactive, ref } from 'vue';

import { i18nMessages } from '../../i18n/messages';

import { XButton } from '../button';
import IconDownloadLine from '../iconfont/icons/download';
import { IconCodeSSlashLine, IconDownload2Line, IconFileExcel2Line, IconFilePdfLine, IconImageLine, IconLoader5Line } from '../iconfont';

import { IXButtonExportOptions, XButtonProps } from './types';

/**
 * 导出到 Excel、PDF、JSON、Image
 */
export const XButtonExport = defineComponent({
  name: 'XButtonExport',
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

    // 触发 download
    const trigger = async (key: keyof IXButtonExportOptions) => {
      loading_.value = true;

      await timer(300).toPromise();

      if (key === 'json') {
        options_.json = await loadOptions(props?.options?.json, options_.json).catch(() => {});
        const opt = options_?.json as any;
        if (opt?.content) {
          const url = window.URL.createObjectURL(new Blob([opt.content], { type: 'data:application/json;charset=utf-8' }));
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', `${opt.filename || new Date().getTime()}.json`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('The json content can not be empty.');
        }
      } else if (key === 'excel') {
        if (props?.options?.excel) {
          await props.options.excel().catch(() => {});
        }
      } else if (key === 'pdf') {
        options_.pdf = await loadOptions(props?.options?.pdf, options_.pdf).catch(() => {});
        const opt = options_?.pdf as any;
        if (opt?.target) {
          // TODO
          // const jsPDF: any = await import('jspdf');
          // const doc = new jsPDF();
          await convertHtmlToCanvas(opt.target).then((image) => {});
        }
      } else if (key === 'image') {
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

        const opt = options_?.image as any;

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
          })
            .then((canvas) => {
              const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
              const a = document.createElement('a');
              a.setAttribute('download', `${opt.filename || new Date().getTime()}.png`);
              a.setAttribute('href', image);
              a.click();
            })
            .catch(() => {});
        }
      }

      loading_.value = false;
    };

    const onActionClick = (e) => {
      trigger(e.key);
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
      trigger,
      download
    };
  },
  render(ctx) {
    return (
      <Dropdown
        disabled={ctx.disabled || ctx.loading_}
        placement={ctx.placement}
        v-slots={{
          overlay: () => (
            <Menu onClick={ctx.onActionClick}>
              {[
                ctx.jsonVisible ? (
                  <MenuItem key='json'>
                    <div class='tw-flex tw-items-center'>
                      <IconCodeSSlashLine class='tw-mr-1' color='primary' scale='1.1' />
                      {ctx.$t(i18nMessages.antd.action.exportToJSON)}
                    </div>
                  </MenuItem>
                ) : (
                  ''
                ),
                ctx.pdfVisible ? (
                  <MenuItem key='pdf'>
                    <div class='tw-flex tw-items-center'>
                      <IconFilePdfLine class='tw-mr-1' color='green' scale='1.1' />
                      {ctx.$t(i18nMessages.antd.action.exportToPDF)}
                    </div>
                  </MenuItem>
                ) : (
                  ''
                ),
                ctx.imageVisible ? (
                  <MenuItem key='image'>
                    <div class='tw-flex tw-items-center'>
                      <IconImageLine class='tw-mr-1' color='orange' scale='1.1' />
                      {ctx.$t(i18nMessages.antd.action.exportToImage)}
                    </div>
                  </MenuItem>
                ) : (
                  ''
                ),
                ctx.excelVisible ? (
                  <MenuItem key='excel'>
                    <div class='tw-flex tw-items-center'>
                      <IconFileExcel2Line class='tw-mr-1' color='blue' scale='1.1' />
                      {ctx.$t(i18nMessages.antd.action.exportToExcel)}
                    </div>
                  </MenuItem>
                ) : (
                  ''
                )
              ]}
            </Menu>
          )
        }}
      >
        <XButton
          block={ctx.block}
          disabled={ctx.disabled}
          ghost={ctx.ghost}
          href={ctx.href}
          htmlType={ctx.htmlType}
          loading={ctx.loading_}
          shape={ctx.shape}
          size={ctx.size}
          target={ctx.target}
          type={ctx.type}
          color={ctx.color}
          spin={false}
          title={ctx.title ? ctx.title : ctx.$t(i18nMessages.antd.action.export)}
        >
          {[
            ctx.loading_ ? <IconLoader5Line spin={ctx.loading_} /> : <IconDownloadLine spin={ctx.loading_} />,
            !ctx.onlyIcon ? <span>{ctx.$t(i18nMessages.antd.action.export)}</span> : ''
          ]}
        </XButton>
      </Dropdown>
    );
  }
});
