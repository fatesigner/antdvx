import { PropType, defineComponent } from 'vue';
import { Field as VeeField } from 'vee-validate';
import { TransitionCollapse, XButton } from 'antdvx';
import { Form, FormItem, Input, Modal, Textarea, notification } from 'ant-design-vue';

import { sysPermissionApi } from '@/api';
import { SysPermissionInput } from '@/api/models';
import { CheckGroup } from '@/app/shared/check-group';
import { PERMISSIONS_TYPE } from '@/app/core/constants';
import { createForm } from '@/app/plugins/vee-validate';

/**
 * PermissionsForm
 */
export const PermissionsForm = defineComponent({
  props: {
    model: {
      type: Object as PropType<SysPermissionInput>,
      default() {
        return {};
      }
    }
  },
  emits: ['close'],
  setup(props: any, { emit }) {
    // 定义表单
    const form = createForm<SysPermissionInput>(
      {
        validateOnMount: false,
        initialValues: props.model,
        validationSchema: {
          Code: 'required',
          Name: 'required',
          Category: 'required'
        }
      },
      async (values) => {
        return sysPermissionApi
          .systemManageSysPermissionSave({
            sysPermissionInput: {
              ...props.model,
              ...values
            }
          })
          .then(() => {
            if (props?.model?.ID) {
              notification.success({ message: 'Update success' });
            } else {
              notification.success({ message: 'Add success' });
            }
            emit('close', values);
          })
          .catch((err) => {
            Modal.error({
              title: err.message
            });
          });
      }
    );

    return {
      form
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-flex-col tw-h-full'>
        <div class='tw-flex-1 tw-overflow-y-auto tw-pt-4 tw-pr-8 tw-pb-4 tw-pl-8'>
          <Form class='tw-max-w-md tw-m-auto tw-pr-8' layout='horizontal' labelAlign='right' labelCol={{ style: { width: '160px' } }}>
            <div class='tw-grid tw-grid-cols-12 tw-gap-4'>
              <FormItem class='tw-col-span-12' label='Permission Code' required>
                <VeeField
                  name='Code'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          placeholder=''
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Permission Name' required>
                <VeeField
                  name='Name'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          placeholder=''
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Permission Category' required>
                <VeeField
                  name='Category'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <CheckGroup
                          dataValueField='value'
                          dataTextField='text'
                          options={PERMISSIONS_TYPE.arr as any}
                          value={field.value}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Remark'>
                <VeeField
                  name='Remark'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Textarea
                          autoSize={{ minRows: 2, maxRows: 12 }}
                          value={field.value}
                          placeholder=''
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : undefined}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
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
      </div>
    );
  }
});
