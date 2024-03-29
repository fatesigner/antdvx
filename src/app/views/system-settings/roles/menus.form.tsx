import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, FormItem, Input, Modal, SelectOptGroup, SelectOption } from 'ant-design-vue';
import { ANTDVX_ICON_NAMES, createXDrawer, Iconfont, TransitionCollapse, XButton, XCombobox, XDrawer } from 'antdvx';
import { IMenu } from 'antdvx/types';
import { Field as VeeField } from 'vee-validate';

import { i18nMessages } from '@/app/i18n';
import { createForm } from '@/app/plugins/vee-validate';
import { getMenusFromRoutes } from '@/app/utils';

/**
 * MenusForm
 */
export const MenusForm = defineComponent({
  props: {
    parent: Object,
    model: {
      type: Object as PropType<any>,
      default() {
        return {};
      }
    }
  },
  emits: ['close'],
  setup(props: any, { emit }) {
    const { t } = useI18n();

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
          label: 'required'
        }
      },
      async (values) => {
        // 判断 children 内是否包含相同 name 的菜单
        if (props?.parent?.children) {
          if (props.parent.children.find((x) => x.name === values.name)) {
            Modal.warning({
              title: 'Warning',
              content: t(i18nMessages.app.systemSettings.menu.duplicatedNameExist)
            });
            return;
          }
        }
        // 提交表单
        emit('close', values);
      }
    );

    return {
      iconChooserPopupRef,
      form
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-h-full tw-flex-col'>
        <div class='tw-flex-1 tw-overflow-y-auto tw-pt-4 tw-pr-8 tw-pb-4 tw-pl-8'>
          <Form
            class='tw-m-auto tw-max-w-md tw-pr-8'
            layout='horizontal'
            labelAlign='right'
            labelCol={{ style: { width: '120px' } }}
          >
            <div class='tw-grid tw-grid-cols-12 tw-gap-4'>
              <FormItem class='tw-col-span-12' label={ctx.$t(i18nMessages.app.systemSettings.menu.form.route)}>
                <VeeField
                  name='route'
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
                          dataLabelField='name'
                          placeholder={ctx.$t(i18nMessages.app.systemSettings.menu.placeholder.route)}
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
                              ctx.form.context.setFieldValue('name', item.name);
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
                                          <span class='tw-w-40 tw-px-2'>
                                            {ctx.$t(i18nMessages.app.systemSettings.menu.form.name)}
                                          </span>
                                          <span class='tw-w-52 tw-px-2'>
                                            {ctx.$t(i18nMessages.app.systemSettings.menu.form.label)}
                                          </span>
                                          <span class='tw-flex-1 tw-px-2'>
                                            {ctx.$t(i18nMessages.app.systemSettings.menu.form.url)}
                                          </span>
                                        </div>
                                      );
                                    }
                                  }}
                                >
                                  {options.map((x, index) => (
                                    <SelectOption key={x.id} value={x.name} title={x.name}>
                                      <div class='tw-flex tw-items-center tw-gap-2'>
                                        <span class='tw-w-4 tw-overflow-hidden tw-whitespace-normal tw-break-words tw-text-right'>
                                          {index + 1}
                                        </span>
                                        <span class='tw-w-40 tw-overflow-hidden tw-whitespace-normal tw-break-words'>
                                          {x.name}
                                        </span>
                                        <span class='tw-w-52 tw-overflow-hidden tw-whitespace-normal tw-break-words'>
                                          {x.label}
                                        </span>
                                        <span class='tw-flex-1 tw-overflow-hidden tw-whitespace-normal tw-break-words'>
                                          {x.url}
                                        </span>
                                      </div>
                                    </SelectOption>
                                  ))}
                                </SelectOptGroup>
                              ];
                            }
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? (
                            <div class='invalid-message'>{errors[0]}</div>
                          ) : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label={ctx.$t(i18nMessages.app.systemSettings.menu.form.name)} required>
                <VeeField
                  name='name'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          allowClear={!ctx.form.context.values.route}
                          readonly={!!ctx.form.context.values.route}
                          placeholder=''
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? (
                            <div class='invalid-message'>{errors[0]}</div>
                          ) : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label={ctx.$t(i18nMessages.app.systemSettings.menu.form.label)} required>
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
                          {meta.touched && !meta.valid && errors.length ? (
                            <div class='invalid-message'>{errors[0]}</div>
                          ) : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label={ctx.$t(i18nMessages.app.systemSettings.menu.form.url)}>
                <VeeField
                  name='url'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          allowClear={!ctx.form.context.values.route}
                          readonly={!!ctx.form.context.values.route}
                          value={field.value}
                          placeholder=''
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? (
                            <div class='invalid-message'>{errors[0]}</div>
                          ) : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label={ctx.$t(i18nMessages.app.systemSettings.menu.form.icon)}>
                <VeeField
                  name='icon'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <XCombobox
                          clearable
                          searchable
                          serverFilter
                          placeholder=''
                          value={field.value}
                          optionsLoader={async (searchInput) => {
                            if (searchInput) {
                              searchInput = searchInput.toLowerCase();
                              return ANTDVX_ICON_NAMES.filter((x) => x?.indexOf(searchInput) > -1).slice(0, 50);
                            }
                            return ANTDVX_ICON_NAMES.slice(0, 50);
                          }}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          v-slots={{
                            options({ options }) {
                              return options.map((x) => (
                                <SelectOption key={x} value={x}>
                                  <div class='tw-flex tw-items-center tw-gap-2'>
                                    <Iconfont name={x} scale={1.4} />
                                    <span class='tw-flex-1 tw-overflow-hidden tw-whitespace-normal tw-break-words'>
                                      {x}
                                    </span>
                                  </div>
                                </SelectOption>
                              ));
                            }
                          }}
                        />,
                        /* <div class='tw-flex tw-items-center tw-gap-2'>
                          <Input
                            class='tw-w-full'
                            value={field.value}
                            allowClear
                            placeholder=''
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                          <XButton
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
                          </XButton>
                        </div>, */
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? (
                            <div class='invalid-message'>{errors[0]}</div>
                          ) : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label={ctx.$t(i18nMessages.app.systemSettings.menu.form.target)}>
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
                              return options.map((x) => (
                                <SelectOption key={x.name} value={x.name}>
                                  <div class='tw-flex tw-items-center tw-gap-2'>
                                    <span class='tw-w-14 tw-overflow-hidden tw-whitespace-normal tw-break-words'>
                                      {x.name}
                                    </span>
                                    <span class='tw-flex-1 tw-overflow-hidden tw-whitespace-normal tw-break-words'>
                                      {x.description}
                                    </span>
                                  </div>
                                </SelectOption>
                              ));
                            }
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? (
                            <div class='invalid-message'>{errors[0]}</div>
                          ) : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
            </div>
          </Form>
        </div>
        <div class='tw-flex tw-justify-end tw-space-x-2 tw-border-t tw-border-gray-200 tw-p-4'>
          <XButton color='secondary' size='large' type='3d' loading={ctx.form.isSubmitting} onClick={ctx.form.submit}>
            {ctx.$t(i18nMessages.app.systemSettings.menu.save)}
          </XButton>
          <XButton
            size='large'
            type='3d'
            onClick={() => {
              ctx.$emit('close');
            }}
          >
            {ctx.$t(i18nMessages.app.systemSettings.menu.cancel)}
          </XButton>
        </div>
        <XDrawer {...ctx.iconChooserPopupRef} />
      </div>
    );
  }
});
