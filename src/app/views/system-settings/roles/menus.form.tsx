import { Field as VeeField } from 'vee-validate';
import { PropType, defineComponent, ref } from 'vue';
import { Form, FormItem, Input, SelectOptGroup, SelectOption } from 'ant-design-vue';
import { TransitionCollapse, XButton, XCombobox, XDrawer, createXDrawer } from '@/antdvx';
import { IMenu } from '@/antdvx/types';

import { getMenusFromRoutes } from '@/app/utils';
import { createForm } from '@/app/plugins/vee-validate';

/**
 * MenusForm
 */
export const MenusForm = defineComponent({
  props: {
    model: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    }
  },
  emits: ['close'],
  setup(props: any, { emit }) {
    const wrapRef = ref();

    // 图标选择 弹出层
    const iconChooserPopupRef = createXDrawer(
      {
        width: '80%',
        destroyOnClose: true
      },
      () => import('./icon.chooser').then(({ IconChooser }) => ({ default: IconChooser })),
      {
        onClose() {
          iconChooserPopupRef.handler.dismiss();
        }
      }
    );

    // 定义表单
    const form = createForm<IMenu>(
      {
        validateOnMount: false,
        initialValues: Object.assign(
          {
            target: '_self'
          },
          props.model
        ),
        validationSchema: {
          name: 'required',
          label: 'required',
          url: 'required'
        }
      },
      async (values) => {
        // 提交表单
        emit('close', values);
      }
    );

    return {
      wrapRef,
      iconChooserPopupRef,
      form
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-flex-col tw-h-full' ref='wrapRef'>
        <div class='tw-flex-1 tw-overflow-y-auto tw-pt-4 tw-pr-8 tw-pb-4 tw-pl-8'>
          <Form class='tw-max-w-md tw-m-auto tw-pr-8' layout='horizontal' labelAlign='right' labelCol={{ style: { width: '120px' } }}>
            <div class='tw-grid tw-grid-cols-12 tw-gap-4'>
              <FormItem class='tw-col-span-12' label='Name' required>
                <VeeField
                  name='name'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <XCombobox
                          autoBind
                          clearable
                          searchable
                          dropdownMatchSelectWidth={false}
                          dataKeyField='id'
                          dataValueField='name'
                          dataTextField='label'
                          dataFilterField='name'
                          dataLabelField='url'
                          placeholder='Select Route Name'
                          value={field.value}
                          optionsLoader={() => {
                            return getMenusFromRoutes(ctx.$router.getRoutes());
                          }}
                          filter={(keywords, option) => {
                            const _keywords = keywords?.toLowerCase();
                            return (
                              option?.name?.toLowerCase()?.indexOf(_keywords) > -1 ||
                              option?.label?.toLowerCase()?.indexOf(_keywords) > -1 ||
                              option?.url?.toLowerCase()?.indexOf(_keywords) > -1
                            );
                          }}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onSelect={({ options, value }) => {
                            const item = options.find((x) => x.name === value);
                            if (item) {
                              ctx.form.context.setFieldValue('label', item.label);
                              ctx.form.context.setFieldValue('url', item.url);
                            }
                          }}
                          v-slots={{
                            options({ options }) {
                              return [
                                <SelectOptGroup
                                  v-slots={{
                                    label() {
                                      return (
                                        <div class='tw-flex tw-items-center tw-gap-2'>
                                          <span class='tw-w-4 tw-px-2'>No</span>
                                          <span class='tw-w-40 tw-px-2'>Name</span>
                                          <span class='tw-w-52 tw-px-2'>Label</span>
                                          <span class='tw-flex-1 tw-px-2'>Url</span>
                                        </div>
                                      );
                                    }
                                  }}>
                                  {options.map((x, index) => (
                                    <SelectOption key={x.id} value={x.name} title={x.url}>
                                      <div class='tw-flex tw-items-center tw-gap-2'>
                                        <span class='tw-w-4 tw-text-right tw-overflow-hidden tw-whitespace-normal tw-break-words'>{index + 1}</span>
                                        <span class='tw-w-40 tw-overflow-hidden tw-whitespace-normal tw-break-words'>{x.name}</span>
                                        <span class='tw-w-52 tw-overflow-hidden tw-whitespace-normal tw-break-words'>{x.label}</span>
                                        <span class='tw-flex-1 tw-overflow-hidden tw-whitespace-normal tw-break-words'>{x.url}</span>
                                      </div>
                                    </SelectOption>
                                  ))}
                                </SelectOptGroup>
                              ];
                            }
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Label' required>
                <VeeField
                  name='label'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          allowClear
                          placeholder=''
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Url' required>
                <VeeField
                  name='url'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          allowClear
                          value={field.value}
                          placeholder=''
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Icon'>
                <VeeField
                  name='icon'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <div class='tw-flex tw-items-center tw-gap-2'>
                          <Input
                            class='tw-w-full'
                            value={field.value}
                            allowClear
                            placeholder=''
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                          {/* <XButton
                            onClick={() => {
                              ctx.iconChooserPopupRef.options.title = 'Select One Icon';
                              ctx.iconChooserPopupRef.compProps.onClose = (e) => {
                                ctx.iconChooserPopupRef.handler.dismiss();
                                if (e) {
                                  ctx.form.context.setFieldValue('icon', e);
                                }
                              };
                              ctx.iconChooserPopupRef.handler.present();
                            }}>
                            Select Icon
                          </XButton> */}
                        </div>,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              {/* <FormItem class='tw-col-span-12' label='Target'>
                <VeeField
                  name='target'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <XCombobox
                          searchable
                          dataKeyField='name'
                          dataValueField='name'
                          dataTextField='name'
                          placeholder='Select how to open page'
                          value={field.value}
                          options={[
                            { name: '_self', description: 'Open in the current window' },
                            { name: '_blank', description: 'Open the target page in a new window' }
                          ]}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          v-slots={{
                            options({ options }) {
                              return [
                                <SelectOptGroup
                                  v-slots={{
                                    label() {
                                      return (
                                        <div class='tw-flex tw-items-center tw-gap-2'>
                                          <span class='tw-w-14 tw-px-2'>Name</span>
                                          <span class='tw-flex-1 tw-px-2'>Description</span>
                                        </div>
                                      );
                                    }
                                  }}>
                                  {options.map((x) => (
                                    <SelectOption key={x.name} value={x.name}>
                                      <div class='tw-flex tw-items-center tw-gap-2'>
                                        <span class='tw-w-14 tw-overflow-hidden tw-whitespace-normal tw-break-words'>{x.name}</span>
                                        <span class='tw-flex-1 tw-overflow-hidden tw-whitespace-normal tw-break-words'>{x.description}</span>
                                      </div>
                                    </SelectOption>
                                  ))}
                                </SelectOptGroup>
                              ];
                            }
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem> */}
            </div>
          </Form>
        </div>
        <div class='tw-flex tw-justify-end tw-space-x-2 tw-p-4 tw-border-t tw-border-gray-200'>
          <XButton color='secondary' size='large' type='3d' loading={ctx.form.isSubmitting} onClick={ctx.form.submit}>
            Save
          </XButton>
          <XButton
            size='large'
            type='3d'
            onClick={() => {
              ctx.$emit('close');
            }}>
            Cancel
          </XButton>
        </div>
        <XDrawer {...ctx.iconChooserPopupRef} />
      </div>
    );
  }
});