import { timer } from 'rxjs';
import { defineComponent, ref } from 'vue';
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import { ExceljsHelper } from '@fatesigner/utils/exceljs';
import {
  ANTDVX_BUTTON_TYPES,
  ANTDVX_COLORS,
  ANTDVX_SIZES,
  IXButtonExportOptions,
  IconArrowDownSLine,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonDownload,
  XButtonEdit,
  XButtonExport,
  XButtonRefresh,
  XButtonSave,
  XButtonSpin,
  XButtonUpload,
  createXModal
} from '@/antdvx';

import { getBase64FromFile } from '@/app/utils';
import { PageWrapper } from '@/app/shared/page-wrapper';

export const ButtonView = defineComponent({
  name: 'ButtonView',
  setup() {
    const selected = ref();

    const exportRef = ref();

    const popupRef = createXModal({
      destroyOnClose: true
    });

    const exportOptions: IXButtonExportOptions = {
      json: {
        filename: 'zadsad',
        content: JSON.stringify({ a: '1', b: '2' })
      },
      image: {
        filename: 'dasdas',
        target: document.body
      },
      async excel() {
        const { workbook } = await ExceljsHelper.addWorksheet(undefined, {
          data: [
            {
              title: 'title 1',
              desc: 'desc 1',
              value: 23123.42
            },
            {
              title: 'title 2',
              desc: 'desc 2',
              value: 33123.42
            },
            {
              title: 'title 3',
              desc: 'desc 3',
              value: 0
            }
          ],
          columns: [
            {
              key: 'title',
              header: '标题',
              style: {
                alignment: {
                  horizontal: 'center',
                  vertical: 'middle'
                }
              }
            },
            {
              key: 'desc',
              header: '描述',
              style: {
                alignment: {
                  horizontal: 'left',
                  vertical: 'middle'
                }
              }
            },
            {
              key: 'value',
              header: '值',
              format: 'currency',
              theadStyle: {
                alignment: {
                  horizontal: 'center'
                },
                fill: {
                  type: 'gradient',
                  gradient: 'angle',
                  degree: 0,
                  stops: [
                    { position: 0, color: { argb: 'ffff00' } },
                    { position: 0.5, color: { argb: 'ffff00' } },
                    { position: 1, color: { argb: 'ffff00' } }
                  ]
                }
              },
              style: {
                alignment: {
                  horizontal: 'right'
                },
                font: {
                  color: { argb: '919191' }
                }
              }
            }
          ],
          autoWidth: true
        });
        await ExceljsHelper.downloadFile(workbook, 'excel');
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
                popupRef.handler.loadComponent(() =>
                  Promise.resolve(
                    defineComponent({
                      render() {
                        return <img src={base64} title='' alt='' />;
                      }
                    })
                  )
                );
                popupRef.handler.present();
              });
            }
          });
      };
    };

    return {
      selected,
      exportRef,
      popupRef,
      exportOptions,
      sizes: ANTDVX_SIZES,
      colors: ANTDVX_COLORS,
      types: ANTDVX_BUTTON_TYPES,
      load,
      upload
    };
  },
  render(ctx) {
    return (
      <PageWrapper title='Button' overflow='scroll'>
        <div class='tw-p-2'>
          <div class='tw-p-4 tw-space-y-4 tw-bg-white'>
            <div class='tw-text-lg'>基础</div>
            <XButton href='https://www.google.com' disabled={false}>
              ddd
            </XButton>
            <div class='tw-grid lg:tw-grid-cols-2 tw-gap-4'>
              {ANTDVX_BUTTON_TYPES.map((type) => (
                <div class='tw-p-2 tw-border tw-border-gray-300'>
                  <div class='tw-text-lg tw-p-2'>{type} button</div>
                  <div class='tw-text-sm tw-p-2'>Colors</div>
                  <div class='tw-flex tw-flex-wrap'>
                    <div class='tw-p-2'>
                      <XButton type={type}>normal</XButton>
                    </div>
                    {ANTDVX_COLORS.map((color) => (
                      <div class='tw-p-2'>
                        <XButton color={color} type={type}>
                          {color}
                        </XButton>
                      </div>
                    ))}
                    <div class='tw-p-2'>
                      <XButton loading type={type}>
                        loading
                      </XButton>
                    </div>
                    <div class='tw-p-2'>
                      <XButton disabled type={type}>
                        disabled
                      </XButton>
                    </div>
                    <div class='tw-p-2'>
                      <XButton disabled color='primary' type={type}>
                        disabled
                      </XButton>
                    </div>
                  </div>
                  <div class='tw-p-2'>
                    <XButton block type={type}>
                      block
                    </XButton>
                  </div>
                  <div class='tw-text-sm tw-p-2'>Sizes</div>
                  <div class='tw-flex tw-flex-wrap'>
                    {ANTDVX_SIZES.map((size) => (
                      <div class='tw-p-2'>
                        <XButton size={size} type={type}>
                          {size}
                        </XButton>
                      </div>
                    ))}
                  </div>
                  <div class='tw-text-sm tw-p-2'>Href Link</div>
                  <div class='tw-flex tw-flex-wrap'>
                    <div class='tw-p-2'>
                      <XButton href='https://www.google.com' target='_blank' type={type}>
                        Redirect
                      </XButton>
                    </div>
                    <div class='tw-p-2'>
                      <XButton disabled href='https://www.google.com' target='_blank' type={type}>
                        Redirect
                      </XButton>
                    </div>
                  </div>
                  <div class='tw-text-sm tw-p-2'>Dropdown</div>
                  <div class='tw-p-2'>
                    <Dropdown
                      v-slots={{
                        overlay() {
                          return (
                            <Menu>
                              <MenuItem key='1'>1st item</MenuItem>
                              <MenuItem key='2'>2nd item</MenuItem>
                              <MenuItem key='3'>3rd item</MenuItem>
                            </Menu>
                          );
                        }
                      }}>
                      <XButton type={type}>
                        Actions
                        <IconArrowDownSLine />
                      </XButton>
                    </Dropdown>
                  </div>
                </div>
              ))}
              <div class='tw-p-2 tw-border tw-border-gray-300'>
                <div class='tw-text-lg tw-p-2'>功能性</div>
                <div class='tw-p-2 tw-text-gray-600 tw-text-sm'>基于 Button 封装的常用的一些操作按钮。</div>
                <div class='tw-p-2 tw-text-gray-500 tw-text-xxs'>
                  用于需要异步操作的按钮，提供一个异步函数 handler，函数执行阶段，将自动添加 loading，结束后，若该函数抛出异常，则自动显示 notification。
                </div>
                <div class='tw-flex tw-flex-wrap tw-p-2 tw-border tw-border-gray-300'>
                  {ANTDVX_BUTTON_TYPES.map((type) => (
                    <div class='tw-p-2'>
                      <XButtonUpload type={type} handler={ctx.upload(3000)} />
                    </div>
                  ))}
                </div>
                <div class='tw-flex tw-flex-wrap tw-p-2 tw-border tw-border-gray-300'>
                  {ANTDVX_BUTTON_TYPES.map((type) => (
                    <div class='tw-p-2'>
                      <XButtonExport type={type} options={ctx.exportOptions} />
                    </div>
                  ))}
                  <div class='tw-p-2'>
                    <XButtonExport type='3d' options={ctx.exportOptions} ref='exportRef' />
                    <XButton
                      size='small'
                      type='link'
                      onClick={() => {
                        ctx.exportRef?.trigger('json');
                      }}>
                      Export json
                    </XButton>
                    <XButton
                      size='small'
                      type='link'
                      onClick={() => {
                        ctx.exportRef?.trigger('image');
                      }}>
                      Export image
                    </XButton>
                  </div>
                </div>
                <div class='tw-flex tw-flex-wrap'>
                  <div class='tw-p-2'>
                    <XButtonAdd notify type='outline' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonEdit notify type='outline' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonSave notify type='outline' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonDelete confirmed notify type='outline' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonRefresh notify type='outline' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonUpload notify type='outline' handler={ctx.upload(3000)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonUpload autosize showIcon={false} type='outline' handler={ctx.upload(3000)}>
                      <div>AAA</div>
                      <div>zzz</div>
                    </XButtonUpload>
                  </div>
                </div>
                <div class='tw-flex tw-flex-wrap'>
                  <div class='tw-p-2'>
                    <XButtonAdd only-icon type='text' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonEdit only-icon type='text' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonSave only-icon type='text' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonDelete confirmed only-icon type='text' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonRefresh only-icon type='text' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonDownload only-icon type='text' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonUpload only-icon type='text' handler={ctx.load(3000, true)} />
                  </div>
                </div>
                <div class='tw-flex tw-flex-wrap'>
                  <div class='tw-p-2'>
                    <XButtonAdd color='success' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonEdit color='primary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonSave color='secondary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonDelete confirmed color='danger' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonRefresh color='primary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonDownload color='primary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonUpload color='secondary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                </div>
                <div class='tw-flex tw-flex-wrap'>
                  <div class='tw-p-2'>
                    <XButtonAdd only-icon color='success' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonEdit only-icon color='primary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonSave only-icon color='secondary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonDelete confirmed only-icon color='danger' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonRefresh only-icon color='primary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonDownload only-icon color='secondary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonUpload only-icon color='secondary' size='mini' type='link' handler={ctx.load(3000, true)} />
                  </div>
                  <div class='tw-p-2'>
                    <XButtonSpin title='AAAAAAAAA' handler={ctx.load(3000, true)}>
                      XSDASDASD
                    </XButtonSpin>
                  </div>
                  <div class='tw-p-2'>
                    <XButtonSpin disabled handler={ctx.load(3000, true)}>
                      XSDASDASD
                    </XButtonSpin>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }
});
